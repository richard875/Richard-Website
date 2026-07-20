import React from "react";
import GUI from "lil-gui";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Clouds, Cloud } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  ColorAverage,
  HueSaturation,
  Vignette,
  Noise,
  DepthOfField,
} from "@react-three/postprocessing";
import { Resolution, KernelSize, BlendFunction } from "postprocessing";
import Mesh, {
  DEFAULT_SAIL_FLOODLIGHTS,
  DEFAULT_DOCK_LIGHTING,
  DEFAULT_STREETLAMP_LIGHTING,
} from "./mesh";
import type {
  SailFloodlightConfig,
  DockLightingConfig,
  StreetlampLightingConfig,
} from "./mesh";
import Inspector from "./inspector";
import { IS_DEV } from "../../constants/environment";
import { INTRO_SOH } from "../../constants/googleTags";
import { GLOBAL_VERTEX_SHADER, GLOBAL_FRAGMENT_SHADER } from "./shader";
import cloudTexture from "../../../static/models/cloud.png";

// Fixed night-mode tuning, kept separate from the day gui sliders so flipping
// "Night Mode" doesn't disturb the day look those sliders control.
// Ambient/hemisphere are the flat, shadowless "atmosphere" fill - at night
// that fill should be next to nothing, barely above zero. The moon
// (directional light below) is the one light meant to actually illuminate
// the scene, strong enough to visibly light up the model's upward-facing
// surfaces on its own; the streetlamps/window glows and sail floodlights
// layer on top of that for local detail.
const NIGHT_AMBIENT_INTENSITY = 0.003 * Math.PI;
const NIGHT_HEMI_INTENSITY = 0.004 * Math.PI;
const NIGHT_HEMI_COLOR = new THREE.Color("#3a4a7a");
const NIGHT_HEMI_GROUND_COLOR = new THREE.Color("#0c1020");
const NIGHT_DIR_INTENSITY = 0.65 * Math.PI;
const NIGHT_DIR_COLOR = new THREE.Color("#dce6ff");
// Moon direction/position: fixed (unlike the day light's randomized spot) so
// the water's moon-glint and the visible moon disc always agree.
const NIGHT_MOON_POSITION = new THREE.Vector3(5, 9, -6);
const NIGHT_SKY_TOP = new THREE.Color("#020305");
const NIGHT_SKY_BOTTOM = new THREE.Color("#0a0e1c");
// The background Cloud puffs use an unlit MeshBasicMaterial (see below), so
// they render at their own flat color regardless of how dim the scene lights
// are - dropping ambient/hemisphere intensity does nothing to them. To make
// them recede into the night background they need their own dark color and
// a much lower opacity, applied directly.
const NIGHT_CLOUD_COLOR = "#141a30";
const NIGHT_CLOUD_OPACITY_SCALE = 0.35;
const NIGHT_FOG_NEAR = 1;
const NIGHT_FOG_FAR = 24;
const DAY_SKY_BOTTOM = new THREE.Color(0xfad6a5);
const DAY_FOG_NEAR = 0.5;
const DAY_FOG_FAR = 18;

// Time-of-day tuning (7am-7pm), used whenever the scene is in day mode (see
// effectiveIsNight below). One keyframe per anchor hour; render values in
// between are linearly interpolated (see interpolateDayLighting), so
// dragging the "Time of Day" gui slider - or just leaving the tab open
// across real time - sweeps smoothly through the whole set rather than
// jumping between fixed looks. The 17:00 (5pm) keyframe deliberately isn't
// listed here - it's built from the existing Ambient/Hemi/Direct Light gui
// slider state instead (see goldenHourKeyframe in Model), which is exactly
// the warm/golden look this scene originally shipped with (and is what the
// gui sliders already default to) - reusing it keeps those sliders live
// rather than leaving them dead once time-of-day drives the render.
type TimeLightingKeyframe = {
  hour: number;
  ambientIntensity: number;
  hemiIntensity: number;
  hemiColorHSL: [number, number, number];
  hemiGroundColorHSL: [number, number, number];
  dirIntensity: number;
  dirColorHSL: [number, number, number];
  // Fixed per-keyframe sun position (unlike the old randomized gui default)
  // so the sun/light arcs deterministically across the sky as hour changes,
  // the same way NIGHT_MOON_POSITION is fixed above.
  dirPosition: [number, number, number];
  skyBottom: number; // hex
  fogNear: number;
  fogFar: number;
  // 0 = fully desaturated toward NEUTRAL_CLOUD_COLOR (crisp midday cloud),
  // 1 = the cloud's own hard-coded pink/peach hex prop, unchanged (see
  // applyCloudWarmth/cloudColor in Model).
  cloudWarmth: number;
  sparkleColor: string;
  sparkleOpacityScale: number;
};

// 7:30am-4pm previously desaturated toward near-white/pale-pastel at the
// midday end (noon dirColorHSL saturation 0.15, cloudWarmth 0) and swung the
// sun almost directly overhead (noon dirPosition y=8) - both read as washed
// out and flat against the rest of the scene's saturated, always-golden
// diorama look (see the reference screenshot). These keep real color and
// warmth at every hour (cloudWarmth never drops below ~0.45) and keep the
// sun at a moderate, raking elevation throughout (peaking around y=4 at
// noon, not 8) so the sails keep visible shadow modeling all day instead of
// flattening out under a near-vertical light.
// hemiColorHSL's hue is pinned to 0.62 (matching goldenHourKeyframe/the
// original scene's sky) across every one of these, rather than drifting
// with time-of-day mood - only saturation/lightness vary. The fixed global
// postprocessing hue rotation below (HueSaturation's `hue` gui slider, 6
// radians =~ -16.2deg, tuned around that one 0.62 value) was pulling any
// lower hue down into cyan/turquoise territory instead of blue once
// rotated, which is what actually made 9am-3pm look wrong.
const DAWN_KEYFRAME: TimeLightingKeyframe = {
  hour: 7,
  ambientIntensity: 0.16 * Math.PI,
  hemiIntensity: 0.65 * Math.PI,
  hemiColorHSL: [0.62, 0.7, 0.5],
  hemiGroundColorHSL: [0.05, 0.75, 0.62],
  dirIntensity: 0.42 * Math.PI,
  dirColorHSL: [0.05, 0.85, 0.78],
  dirPosition: [7, 1.2, 4],
  skyBottom: 0xffb98f,
  fogNear: 0.6,
  fogFar: 16,
  cloudWarmth: 0.65,
  sparkleColor: "#ffd9b3",
  sparkleOpacityScale: 0.65,
};
const MORNING_KEYFRAME: TimeLightingKeyframe = {
  hour: 10,
  ambientIntensity: 0.22 * Math.PI,
  hemiIntensity: 0.88 * Math.PI,
  hemiColorHSL: [0.62, 0.85, 0.58],
  hemiGroundColorHSL: [0.1, 0.7, 0.72],
  dirIntensity: 0.52 * Math.PI,
  dirColorHSL: [0.11, 0.55, 0.9],
  dirPosition: [5, 2.6, 3],
  skyBottom: 0xffd6a3,
  fogNear: 0.5,
  fogFar: 17,
  cloudWarmth: 0.55,
  sparkleColor: "#fff2d9",
  sparkleOpacityScale: 0.9,
};
// (hemiColorHSL hue pinned to 0.62 here too - see the comment above DAWN.)
// The sun position here (and at 15:00 below) deliberately keeps a strong
// horizontal offset rather than swinging up toward vertical - a near-
// overhead light was hitting the glass roof material (near-mirror, 0.08
// roughness in day mode - see glassMaterial in mesh.tsx) at close to normal
// incidence, mirror-reflecting the light straight at the camera and blowing
// Bloom out into a solid white blob across the sails. Keeping the elevation
// modest and the horizontal component large avoids that hotspot angle
// entirely while still reading as "midday" through color/brightness alone.
const NOON_KEYFRAME: TimeLightingKeyframe = {
  hour: 12,
  ambientIntensity: 0.24 * Math.PI,
  hemiIntensity: 0.92 * Math.PI,
  hemiColorHSL: [0.62, 0.9, 0.58],
  hemiGroundColorHSL: [0.12, 0.6, 0.78],
  dirIntensity: 0.5 * Math.PI,
  dirColorHSL: [0.13, 0.35, 0.95],
  dirPosition: [3, 2.4, -1],
  skyBottom: 0xffd9a3,
  fogNear: 0.45,
  fogFar: 18,
  cloudWarmth: 0.45,
  sparkleColor: "#fff8e6",
  sparkleOpacityScale: 1,
};
const AFTERNOON_KEYFRAME: TimeLightingKeyframe = {
  hour: 15,
  ambientIntensity: 0.22 * Math.PI,
  hemiIntensity: 0.9 * Math.PI,
  hemiColorHSL: [0.62, 0.95, 0.56],
  hemiGroundColorHSL: [0.09, 0.75, 0.75],
  dirIntensity: 0.6 * Math.PI,
  dirColorHSL: [0.1, 0.7, 0.88],
  dirPosition: [-3, 2.6, -1.5],
  skyBottom: 0xffcf9e,
  fogNear: 0.48,
  fogFar: 18,
  cloudWarmth: 0.75,
  sparkleColor: "#ffe6c2",
  sparkleOpacityScale: 0.97,
};
// 19:00 is a real, visible step dimmer than goldenHourKeyframe - about 70%
// of its light intensities, with lightness pulled down a good deal further
// too (hue/saturation stay identical to golden hour; see the note below on
// why saturation must never drop). An earlier, much gentler version of this
// (differing from golden hour by only ~5%) looked completely unchanged in
// the actual EffectComposer output - the fixed Bloom/ColorAverage/tone-
// mapping chain (tuned only around the one original golden-hour look)
// compresses small differences away entirely, so "gentle" has to mean
// perceptually gentle after that pipeline, not numerically gentle before it.
// hemiColorHSL/dirColorHSL/hemiGroundColorHSL keep the exact same hue AND
// saturation as goldenHourKeyframe (0.62/1 and 0.095-0.1/1) and only step
// lightness down - saturation has to stay matched, not drop: desaturating a
// color while holding its lightness constant makes it paler/whiter, which
// reads as BRIGHTER even though the underlying light intensities are lower.
// That's what made an earlier version of this get steadily brighter past
// 17:00 instead of dimmer.
const DUSK_KEYFRAME: TimeLightingKeyframe = {
  hour: 19,
  ambientIntensity: 0.14 * Math.PI,
  hemiIntensity: 0.56 * Math.PI,
  hemiColorHSL: [0.62, 1, 0.42],
  hemiGroundColorHSL: [0.095, 1, 0.5],
  dirIntensity: 0.35 * Math.PI,
  dirColorHSL: [0.1, 1, 0.75],
  dirPosition: [-6.5, 0.95, 5.25],
  skyBottom: 0xe8985a,
  fogNear: 0.6,
  fogFar: 16,
  cloudWarmth: 1,
  sparkleColor: "#ffcf8a",
  sparkleOpacityScale: 0.8,
};

// The one static "outside daylight hours" look used whenever the OS/browser
// theme is light but the real clock (or the overridden time slider) falls
// before 7am or at/after 7pm - see isTwilight in Model. Meant to read as
// roughly "20:00" - a small, direct step dimmer than DUSK_KEYFRAME (19:00),
// not independently derived math: hue and saturation are copied from
// DUSK_KEYFRAME exactly unchanged, only intensity and lightness step down a
// little further. The garish red an earlier version of this produced wasn't
// actually these values - it was the clouds rendering through a completely
// different, flattened single-color code path (see the cloudColor comment
// in Model), which made "Dimmed" look nothing like 19:00 even when these
// numbers were close to DUSK_KEYFRAME's.
const TWILIGHT_AMBIENT_INTENSITY = 0.12 * Math.PI;
const TWILIGHT_HEMI_INTENSITY = 0.48 * Math.PI;
const TWILIGHT_HEMI_COLOR = new THREE.Color().setHSL(0.62, 1, 0.36);
const TWILIGHT_HEMI_GROUND_COLOR = new THREE.Color().setHSL(0.095, 1, 0.43);
const TWILIGHT_DIR_INTENSITY = 0.3 * Math.PI;
const TWILIGHT_DIR_COLOR = new THREE.Color().setHSL(0.1, 1, 0.68);
const TWILIGHT_SUN_POSITION = new THREE.Vector3(-6.7, 0.9, 5.3);
const TWILIGHT_SKY_BOTTOM = new THREE.Color(0xd18951);
const TWILIGHT_FOG_NEAR = 0.62;
const TWILIGHT_FOG_FAR = 15.5;
const TWILIGHT_CLOUD_OPACITY_SCALE = 0.95;
const TWILIGHT_SPARKLE_COLOR = "#ffba7c";
const TWILIGHT_SPARKLE_OPACITY_SCALE = 0.75;
const TWILIGHT_SPARKLES_COUNT = 55;

// Pale, cool near-white the day clouds desaturate toward at cloudWarmth=0
// (crisp midday puffs) before blending back up to each cloud's own hard-
// coded pink/peach hex at cloudWarmth=1 (golden hour, unchanged from today).
const NEUTRAL_CLOUD_COLOR = new THREE.Color("#f5f9ff");

const lerpHSL = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  THREE.MathUtils.lerp(a[0], b[0], t),
  THREE.MathUtils.lerp(a[1], b[1], t),
  THREE.MathUtils.lerp(a[2], b[2], t),
];

const lerpVec3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  THREE.MathUtils.lerp(a[0], b[0], t),
  THREE.MathUtils.lerp(a[1], b[1], t),
  THREE.MathUtils.lerp(a[2], b[2], t),
];

// Piecewise-linear interpolation across sorted keyframes (ascending `hour`).
// `hour` is clamped to the keyframe span rather than wrapping - callers are
// expected to only invoke this for hours already known to be within
// [7, 19) (see isTwilight in Model), which TWILIGHT_* handles separately.
const interpolateDayLighting = (
  hour: number,
  keyframes: TimeLightingKeyframe[],
): TimeLightingKeyframe => {
  const clampedHour = THREE.MathUtils.clamp(
    hour,
    keyframes[0].hour,
    keyframes[keyframes.length - 1].hour,
  );
  let lower = keyframes[0];
  let upper = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (
      clampedHour >= keyframes[i].hour &&
      clampedHour <= keyframes[i + 1].hour
    ) {
      lower = keyframes[i];
      upper = keyframes[i + 1];
      break;
    }
  }
  const span = upper.hour - lower.hour;
  const t = span === 0 ? 0 : (clampedHour - lower.hour) / span;

  return {
    hour: clampedHour,
    ambientIntensity: THREE.MathUtils.lerp(
      lower.ambientIntensity,
      upper.ambientIntensity,
      t,
    ),
    hemiIntensity: THREE.MathUtils.lerp(
      lower.hemiIntensity,
      upper.hemiIntensity,
      t,
    ),
    hemiColorHSL: lerpHSL(lower.hemiColorHSL, upper.hemiColorHSL, t),
    hemiGroundColorHSL: lerpHSL(
      lower.hemiGroundColorHSL,
      upper.hemiGroundColorHSL,
      t,
    ),
    dirIntensity: THREE.MathUtils.lerp(
      lower.dirIntensity,
      upper.dirIntensity,
      t,
    ),
    dirColorHSL: lerpHSL(lower.dirColorHSL, upper.dirColorHSL, t),
    dirPosition: lerpVec3(lower.dirPosition, upper.dirPosition, t),
    skyBottom: new THREE.Color(lower.skyBottom)
      .lerp(new THREE.Color(upper.skyBottom), t)
      .getHex(),
    fogNear: THREE.MathUtils.lerp(lower.fogNear, upper.fogNear, t),
    fogFar: THREE.MathUtils.lerp(lower.fogFar, upper.fogFar, t),
    cloudWarmth: THREE.MathUtils.lerp(lower.cloudWarmth, upper.cloudWarmth, t),
    sparkleColor: new THREE.Color(lower.sparkleColor)
      .lerp(new THREE.Color(upper.sparkleColor), t)
      .getStyle(),
    sparkleOpacityScale: THREE.MathUtils.lerp(
      lower.sparkleOpacityScale,
      upper.sparkleOpacityScale,
      t,
    ),
  };
};

// Ticks once a minute off the browser's real local clock - fine-grained
// enough that a visitor leaving the tab open across, say, sunset actually
// sees the scene drift, without re-rendering every frame for a value that
// only matters at whole-minute resolution.
const useCurrentHour = () => {
  const readHour = () => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  };
  const [hour, setHour] = React.useState(readHour);
  React.useEffect(() => {
    const id = setInterval(() => setHour(readHour()), 60_000);
    return () => clearInterval(id);
  }, []);
  return hour;
};

const SydneyOperaHouse = React.memo(() => (
  <Canvas
    id={`${INTRO_SOH}_2`}
    className="canvas"
    shadows
    legacy={true}
    camera={{ position: [0, 2.6, 5], fov: 65 }}
    // Explicitly request the discrete/high-performance GPU on hybrid-graphics
    // laptops (Intel+NVIDIA/AMD) instead of leaving the choice to the browser,
    // which often defaults a WebGL context to the integrated GPU to save
    // power - exactly the wrong tradeoff for a scene with ~30 dynamic lights.
    // antialias/stencil are both dropped because EffectComposer below (see
    // its own multisampling={0} comment) owns the actual render targets - the
    // canvas's own default framebuffer is never what ends up on screen, so
    // paying for a multisampled backbuffer and a stencil attachment it never
    // uses is pure waste.
    gl={{
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
    }}
  >
    <Model />
  </Canvas>
));

const Model = React.memo(() => {
  // Tight fit around the model's actual extent (it lives within roughly
  // +/-1.5 units of the origin - see the sail/dock/landscape fixture
  // coordinate arrays in mesh.tsx) plus margin, not the scene's raw
  // (pre-0.0003-scale) gltf units. The previous +/-50 ortho frustum devoted
  // well over 99% of the 3500x3500 shadow map's texels to empty space
  // around the model, which is both wasteful to render and gives the model
  // itself far worse effective shadow resolution than the map size implies.
  const cameraDirection = 5;
  const { scene, camera } = useThree();

  // Hooks
  // three r155 removed `useLegacyLights`; light intensities are now physically
  // scaled and render dimmer. Multiply the original (three 0.154) values by PI
  // to restore the pre-r155 brightness the scene was tuned for.
  const [ambientLightIntensity, setAmbientLightIntensity] = React.useState(
    0.2 * Math.PI,
  );
  const [hemiLightIntensity, setHemiLightIntensity] = React.useState(
    0.8 * Math.PI,
  );
  const [hemiLightColorX, setHemiLightColorX] = React.useState(0.62);
  const [hemiLightColorY, setHemiLightColorY] = React.useState(1);
  const [hemiLightColorZ, setHemiLightColorZ] = React.useState(0.6);
  const [hemiGroundColorX, setHemiGroundColorX] = React.useState(0.095);
  const [hemiGroundColorY, setHemiGroundColorY] = React.useState(1);
  const [hemiGroundColorZ, setHemiGroundColorZ] = React.useState(0.75);
  const [hemiPositionX, setHemiPositionX] = React.useState(0);
  const [hemiPositionY, setHemiPositionY] = React.useState(20);
  const [hemiPositionZ, setHemiPositionZ] = React.useState(0);
  const [dirLightIntensity, setDirLightIntensity] = React.useState(
    0.5 * Math.PI,
  );
  const [dirLightColorX, setDirLightColorX] = React.useState(0.1);
  const [dirLightColorY, setDirLightColorY] = React.useState(1);
  const [dirLightColorZ, setDirLightColorZ] = React.useState(0.95);
  // Fixed rather than randomized - this position now doubles as the 17:00
  // (5pm) keyframe anchor for the time-of-day system below (see
  // goldenHourKeyframe), which needs a deterministic starting point to
  // interpolate the sun's arc from/to across the rest of the day.
  const [dirPositionX, setDirPositionX] = React.useState(-6);
  const [dirPositionY, setDirPositionY] = React.useState(1);
  const [dirPositionZ, setDirPositionZ] = React.useState(5);
  const [groundColorX, setGroundColorX] = React.useState(0.08);
  const [groundColorY, setGroundColorY] = React.useState(1);
  const [groundColorZ, setGroundColorZ] = React.useState(0.75);
  const [skyOffset, setSkyOffset] = React.useState(43);
  const [skyExponent, setSkyExponent] = React.useState(0.6);
  const [skySphereGeometryX, setSkySphereGeometryX] = React.useState(215);
  const [skySphereGeometryY, setSkySphereGeometryY] = React.useState(0);
  const [skySphereGeometryZ, setSkySphereGeometryZ] = React.useState(15);
  const [bloomIntensity, setBloomIntensity] = React.useState(10.0);
  const [luminanceThreshold, setLuminanceThreshold] = React.useState(1);
  const [luminanceSmoothing, setLuminanceSmoothing] = React.useState(0.5);
  const [brightness, setBrightness] = React.useState(0.15);
  const [contrast, setContrast] = React.useState(-0.2);
  const [hue, setHue] = React.useState(6);
  const [saturation, setSaturation] = React.useState(0.4);
  const [sparklesOpacity, setSparklesOpacity] = React.useState(0.2);
  const [cloudOpacity, setCloudOpacity] = React.useState(0.95);
  const [floatIntensity, setFloatIntensity] = React.useState(2);
  const [parallaxStrength, setParallaxStrength] = React.useState(2);
  const [vignetteDarkness, setVignetteDarkness] = React.useState(0.65);
  const [noiseOpacity, setNoiseOpacity] = React.useState(0.025);
  const [dofFocusRange, setDofFocusRange] = React.useState(8.5);
  const [dofBokehScale, setDofBokehScale] = React.useState(5);
  const [groundCloudGap, setGroundCloudGap] = React.useState(2.5);
  const [isNight, setIsNight] = React.useState(true);
  // Off by default: day/night instead tracks the visitor's OS-level
  // light/dark theme preference (see systemIsDarkMode below). Flipping this
  // on lets the manual "Night Mode" checkbox above take over completely -
  // while off, that checkbox still exists in the GUI but has no effect,
  // since effectiveIsNight (below) ignores it entirely.
  const [overrideScene, setOverrideScene] = React.useState(false);
  // Mirrors the OS `prefers-color-scheme` media query. Not routed through
  // the shared useDarkModeManager hook (used elsewhere on this page) -
  // that hook's job also includes driving `document.body.style.
  // backgroundColor`, a side effect this 3D scene has no business
  // triggering a second time.
  const [systemIsDarkMode, setSystemIsDarkMode] = React.useState(true);
  // Manual "Daytime" gui slider (7am-7pm) - only takes effect once Override
  // Scene is on AND Night Mode is off (see the Time Option gui sync effect
  // below and timeOverrideActive further down). Otherwise the scene follows
  // the visitor's real local clock via useCurrentHour.
  const [timeOfDayHour, setTimeOfDayHour] = React.useState(12);
  // Manual "Dimmed" gui checkbox - forces the twilight/"Static Scene" look
  // (see TWILIGHT_* above and isTwilight below) regardless of the Daytime
  // slider's value. Same enable condition as Daytime itself (Override Scene
  // on, Night Mode off); checking it also disables Daytime, since the hour
  // no longer matters once twilight is being forced.
  const [dimmed, setDimmed] = React.useState(false);
  // Handles to the gui's Night Mode/Daytime/Dimmed controllers, set once by
  // createPanel below - kept in a ref (not local consts inside createPanel)
  // so the sync effect further down can imperatively re-disable/re-value
  // them whenever overrideScene/isNight/systemIsDarkMode/dimmed change,
  // without needing createPanel itself to ever re-run (it's still only
  // called once, on mount).
  const nightModeControllerRef = React.useRef<any>(null);
  const timeOfDayControllerRef = React.useRef<any>(null);
  const dimmedControllerRef = React.useRef<any>(null);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemIsDarkMode = () =>
      setSystemIsDarkMode(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", updateSystemIsDarkMode);
    updateSystemIsDarkMode();
    return () =>
      mediaQueryList.removeEventListener("change", updateSystemIsDarkMode);
  }, []);

  // The value every day/night branch below actually reads - the OS theme by
  // default, or the manual "Night Mode" checkbox once Override Scene is on.
  const effectiveIsNight = overrideScene ? isNight : systemIsDarkMode;
  const realHour = useCurrentHour();
  // The time slider only matters once you've both opted into manual control
  // (Override Scene) and aren't forcing full Night Mode - otherwise the real
  // clock drives the scene, same as effectiveIsNight follows the OS theme by
  // default above.
  const timeOverrideActive = overrideScene && !isNight;
  const effectiveHour = timeOverrideActive ? timeOfDayHour : realHour;
  // "Dimmed" forces the twilight/"Static Scene" look on demand - same gate
  // as timeOverrideActive (Override Scene on, Night Mode off), so it can
  // never fire while night mode (auto or manual) is already showing its own
  // always-on look.
  const dimmedOverrideActive = overrideScene && !isNight && dimmed;
  // The one extra "outside daylight hours" scene (see TWILIGHT_* above) -
  // only relevant in day mode; night mode already has its own always-on look
  // regardless of clock time. Strictly > 19 (not >= 19) so hour 19 exactly -
  // the Daytime slider's own max value - still resolves to DUSK_KEYFRAME via
  // the day interpolation below rather than jumping straight to the twilight
  // look right at the boundary you're most likely to actually test.
  const isTwilight =
    !effectiveIsNight &&
    (dimmedOverrideActive || effectiveHour < 7 || effectiveHour > 19);
  // One entry per sail floodlight - position, target ("rotation": a
  // spotLight aims from position at target rather than having a rotation
  // of its own, so target x/y/z is what the GUI calls Rotation X/Y/Z),
  // angle, and intensity are all independently GUI-adjustable per light.
  const [sailFloodlights, setSailFloodlights] = React.useState<
    SailFloodlightConfig[]
  >(() =>
    DEFAULT_SAIL_FLOODLIGHTS.map((light) => ({
      position: [...light.position] as [number, number, number],
      target: [...light.target] as [number, number, number],
      angle: light.angle,
      intensity: light.intensity,
    })),
  );

  const updateSailFloodlightVector = (
    index: number,
    key: "position" | "target",
    axis: 0 | 1 | 2,
    value: number,
  ) => {
    setSailFloodlights((prev) =>
      prev.map((light, i) => {
        if (i !== index) return light;
        const nextVector = [...light[key]] as [number, number, number];
        nextVector[axis] = value;
        return { ...light, [key]: nextVector };
      }),
    );
  };

  const updateSailFloodlightScalar = (
    index: number,
    key: "angle" | "intensity",
    value: number,
  ) => {
    setSailFloodlights((prev) =>
      prev.map((light, i) =>
        i === index ? { ...light, [key]: value } : light,
      ),
    );
  };

  // Every dock light shares these same parameters ("identical lighting
  // parameters ... across all fixtures for a consistent appearance"), so
  // unlike sailFloodlights this is one shared config object rather than a
  // per-fixture array.
  const [dockLighting, setDockLighting] = React.useState<DockLightingConfig>(
    DEFAULT_DOCK_LIGHTING,
  );

  const updateDockLighting = (key: keyof DockLightingConfig, value: number) => {
    setDockLighting((prev) => ({ ...prev, [key]: value }));
  };

  // Same shared-config pattern as dockLighting above - all 14 streetlamp
  // posts are identical fixtures, so they read from one config object
  // rather than a per-fixture array like sailFloodlights.
  const [streetlampLighting, setStreetlampLighting] =
    React.useState<StreetlampLightingConfig>(DEFAULT_STREETLAMP_LIGHTING);

  const updateStreetlampLighting = (
    key: keyof StreetlampLightingConfig,
    value: number,
  ) => {
    setStreetlampLighting((prev) => ({ ...prev, [key]: value }));
  };

  // Lights
  // Still used as the sky shader's initial topColor value below (line ~642)
  // and to build the 17:00 keyframe's HSL tuple - the actual day/night
  // hemisphere light color is effectiveHemiColor further down.
  const hemiLightColor = new THREE.Color();
  hemiLightColor.setHSL(hemiLightColorX, hemiLightColorY, hemiLightColorZ);

  const hemiPosition = new THREE.Vector3(
    hemiPositionX,
    hemiPositionY,
    hemiPositionZ,
  );

  // Ground
  const groundColor = new THREE.Color();
  groundColor.setHSL(groundColorX, groundColorY, groundColorZ);

  // The 17:00 (5pm) keyframe is built from the Ambient/Hemi/Direct Light gui
  // slider state directly - the same warm/golden values this scene has
  // always defaulted to (see the dirPositionX/Y/Z comment above) - so those
  // sliders stay live for tuning that one anchor instead of going dead once
  // time-of-day drives the render. Only its inputs (not the object itself)
  // need to be listed as deps since it's rebuilt fresh every render anyway.
  const goldenHourKeyframe: TimeLightingKeyframe = {
    hour: 17,
    ambientIntensity: ambientLightIntensity,
    hemiIntensity: hemiLightIntensity,
    hemiColorHSL: [hemiLightColorX, hemiLightColorY, hemiLightColorZ],
    hemiGroundColorHSL: [hemiGroundColorX, hemiGroundColorY, hemiGroundColorZ],
    dirIntensity: dirLightIntensity,
    dirColorHSL: [dirLightColorX, dirLightColorY, dirLightColorZ],
    dirPosition: [dirPositionX, dirPositionY, dirPositionZ],
    skyBottom: DAY_SKY_BOTTOM.getHex(),
    fogNear: DAY_FOG_NEAR,
    fogFar: DAY_FOG_FAR,
    cloudWarmth: 1,
    sparkleColor: "#fff3e0",
    sparkleOpacityScale: 1,
  };
  const dayKeyframes: TimeLightingKeyframe[] = [
    DAWN_KEYFRAME,
    MORNING_KEYFRAME,
    NOON_KEYFRAME,
    AFTERNOON_KEYFRAME,
    goldenHourKeyframe,
    DUSK_KEYFRAME,
  ];
  const dayLighting = interpolateDayLighting(effectiveHour, dayKeyframes);
  const dayHemiColor = new THREE.Color().setHSL(...dayLighting.hemiColorHSL);
  const dayHemiGroundColor = new THREE.Color().setHSL(
    ...dayLighting.hemiGroundColorHSL,
  );
  const dayDirColor = new THREE.Color().setHSL(...dayLighting.dirColorHSL);
  const dayDirPosition = new THREE.Vector3(...dayLighting.dirPosition);

  // Night mode swaps in fixed lighting/atmosphere values instead of the day
  // gui sliders above, so toggling it never disturbs the day-tuned values.
  // Twilight (see isTwilight above) sits between the two: still "day" as far
  // as effectiveIsNight is concerned, but past the 7am-7pm window the
  // time-of-day keyframes cover, so it gets its own fixed TWILIGHT_* look
  // rather than extrapolating the day curve indefinitely.
  const effectiveAmbientIntensity = effectiveIsNight
    ? NIGHT_AMBIENT_INTENSITY
    : isTwilight
      ? TWILIGHT_AMBIENT_INTENSITY
      : dayLighting.ambientIntensity;
  const effectiveHemiIntensity = effectiveIsNight
    ? NIGHT_HEMI_INTENSITY
    : isTwilight
      ? TWILIGHT_HEMI_INTENSITY
      : dayLighting.hemiIntensity;
  const effectiveHemiColor = effectiveIsNight
    ? NIGHT_HEMI_COLOR
    : isTwilight
      ? TWILIGHT_HEMI_COLOR
      : dayHemiColor;
  const effectiveHemiGroundColor = effectiveIsNight
    ? NIGHT_HEMI_GROUND_COLOR
    : isTwilight
      ? TWILIGHT_HEMI_GROUND_COLOR
      : dayHemiGroundColor;
  const effectiveDirIntensity = effectiveIsNight
    ? NIGHT_DIR_INTENSITY
    : isTwilight
      ? TWILIGHT_DIR_INTENSITY
      : dayLighting.dirIntensity;
  const effectiveDirColor = effectiveIsNight
    ? NIGHT_DIR_COLOR
    : isTwilight
      ? TWILIGHT_DIR_COLOR
      : dayDirColor;
  // Fixed moon/twilight position instead of the day light's keyframed arc,
  // so the visible moon disc and the water's moon-glint always agree at
  // night, same as before.
  const effectiveDirPosition = effectiveIsNight
    ? NIGHT_MOON_POSITION
    : isTwilight
      ? TWILIGHT_SUN_POSITION
      : dayDirPosition;

  // The Cloud puffs are unlit, so night-dimming them means swapping their
  // color/opacity directly rather than relying on scene light intensity.
  // Twilight deliberately does NOT get its own flat cloud color the way
  // night does - it used to (TWILIGHT_CLOUD_COLOR), which flattened all 9
  // puffs' own distinct hard-coded hues into one uniform wash and, combined
  // with Bloom/ColorAverage, was a big part of why "Dimmed" looked so much
  // worse than DUSK_KEYFRAME (19:00) despite similar light values - the
  // clouds were on a completely different code path. Twilight now reuses
  // the exact same per-cloud full-warmth coloring as any other daytime hour
  // (cloudWarmth=1, same as DUSK_KEYFRAME/goldenHourKeyframe), so its clouds
  // look identical to 19:00's; only intensity/lightness differ.
  const cloudColor = (dayColor: string) => {
    if (effectiveIsNight) return NIGHT_CLOUD_COLOR;
    const warmth = isTwilight ? 1 : dayLighting.cloudWarmth;
    return NEUTRAL_CLOUD_COLOR.clone().lerp(
      new THREE.Color(dayColor),
      THREE.MathUtils.clamp(warmth, 0, 1),
    );
  };
  const resolveCloudOpacity = (mult: number) =>
    cloudOpacity *
    mult *
    (effectiveIsNight
      ? NIGHT_CLOUD_OPACITY_SCALE
      : isTwilight
        ? TWILIGHT_CLOUD_OPACITY_SCALE
        : 1);

  const uniforms = React.useMemo(
    () => ({
      topColor: { value: hemiLightColor },
      bottomColor: { value: DAY_SKY_BOTTOM.clone() },
      offset: { value: skyOffset },
      exponent: { value: skyExponent },
    }),
    [],
  );

  React.useEffect(() => {
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, DAY_FOG_NEAR, DAY_FOG_FAR);
    scene.fog.color.copy(uniforms["bottomColor"].value);

    // Lil GUI Settings
    if (IS_DEV || window.location.hash === "#debug") createPanel();
  }, []);

  // Keeps the Time Option gui in sync with overrideScene/isNight/
  // systemIsDarkMode/dimmed - the single place that decides what's enabled
  // and what Night Mode displays, since createPanel itself only runs once
  // and never sees later state changes on its own.
  React.useEffect(() => {
    const nightModeController = nightModeControllerRef.current;
    const timeOfDayController = timeOfDayControllerRef.current;
    const dimmedController = dimmedControllerRef.current;
    if (!nightModeController || !timeOfDayController || !dimmedController)
      return;

    nightModeController.disable(!overrideScene);
    if (!overrideScene) {
      // Not overridden - Night Mode is just a (disabled) readout of the OS
      // theme. Going through setValue (rather than mutating the bound
      // settings object directly) also fires its onChange, which keeps the
      // `isNight` React state seeded with the current OS value - so the
      // moment Override Scene does get checked, Night Mode starts already
      // matching whatever the OS currently says instead of some stale value.
      nightModeController.setValue(systemIsDarkMode);
    }

    // Dimmed shares Daytime's base gate (Override Scene on, Night Mode
    // off) - initially disabled (Override Scene starts unchecked), and
    // disabled again the instant Night Mode is checked.
    const baseDisabled = !overrideScene || isNight;
    dimmedController.disable(baseDisabled);

    // Daytime only takes over from the real clock once you've explicitly
    // opted into manual control (Override Scene) AND Night Mode is off, AND
    // additionally disabled whenever Dimmed is forcing the twilight/"Static
    // Scene" look instead - the hour no longer matters once that's active.
    // Matches timeOverrideActive/dimmedOverrideActive above exactly.
    timeOfDayController.disable(baseDisabled || dimmed);
  }, [overrideScene, isNight, systemIsDarkMode, dimmed]);

  // Swap the sky/fog palette and distances as night mode, twilight, and
  // time-of-day change. Fog and background share the same Color instance
  // (assigned above), so mutating it here keeps the horizon and the fog
  // blending seamlessly either way. The dependency array lists the
  // individual gui slider/hour primitives that feed dayLighting/dayHemiColor
  // rather than those derived objects themselves, since those are rebuilt
  // (new object identity) on every render.
  React.useEffect(() => {
    if (!scene.fog) return;
    uniforms.topColor.value.copy(
      effectiveIsNight
        ? NIGHT_SKY_TOP
        : isTwilight
          ? TWILIGHT_HEMI_COLOR
          : dayHemiColor,
    );
    uniforms.bottomColor.value.copy(
      effectiveIsNight
        ? NIGHT_SKY_BOTTOM
        : isTwilight
          ? TWILIGHT_SKY_BOTTOM
          : new THREE.Color(dayLighting.skyBottom),
    );
    scene.fog.color.copy(uniforms.bottomColor.value);
    (scene.fog as THREE.Fog).near = effectiveIsNight
      ? NIGHT_FOG_NEAR
      : isTwilight
        ? TWILIGHT_FOG_NEAR
        : dayLighting.fogNear;
    (scene.fog as THREE.Fog).far = effectiveIsNight
      ? NIGHT_FOG_FAR
      : isTwilight
        ? TWILIGHT_FOG_FAR
        : dayLighting.fogFar;
  }, [
    effectiveIsNight,
    isTwilight,
    effectiveHour,
    ambientLightIntensity,
    hemiLightIntensity,
    hemiLightColorX,
    hemiLightColorY,
    hemiLightColorZ,
    hemiGroundColorX,
    hemiGroundColorY,
    hemiGroundColorZ,
    dirLightIntensity,
    dirLightColorX,
    dirLightColorY,
    dirLightColorZ,
    dirPositionX,
    dirPositionY,
    dirPositionZ,
  ]);

  // Subtle camera parallax that drifts toward the pointer for a sense of depth.
  useFrame((state, delta) => {
    const targetX = state.pointer.x * parallaxStrength;
    const targetY = 2.8 + state.pointer.y * parallaxStrength * 0.4;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      10,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      10,
      delta,
    );
    camera.lookAt(0, 0.5, 0);
  });

  const createPanel = () => {
    const panel = new GUI({ width: 310 });
    const ambientLightFolder = panel.addFolder("Ambient Light");
    const hemiLightFolder = panel.addFolder("Hemi Light");
    const dirLightFolder = panel.addFolder("Direct Light");
    const groundFolder = panel.addFolder("Ground");
    const skyFolder = panel.addFolder("Sky");
    const atmosphereFolder = panel.addFolder("Atmosphere");
    const effectsFolder = panel.addFolder("Effects");
    const timeOptionFolder = panel.addFolder("Time Option");
    const sailFloodlightFolder = panel.addFolder("Sail Floodlights");
    const dockLightingFolder = panel.addFolder("Dock Lights");
    const streetlampLightingFolder = panel.addFolder("Streetlamp Lights");
    panel.close();

    // Position the lil-gui panel at the top-left so it doesn't block the view
    (panel as any).domElement.style.position = "absolute";
    (panel as any).domElement.style.top = "0px";
    (panel as any).domElement.style.left = "30px";
    (panel as any).domElement.style.right = "auto";
    (panel as any).domElement.style.zIndex = "1000";
    (panel as any).domElement.style.border = "1px solid #ccc";

    const settings = {
      ambientLightIntensity: ambientLightIntensity,
      hemiLightIntensity: hemiLightIntensity,
      hemiLightColorX: hemiLightColorX,
      hemiLightColorY: hemiLightColorY,
      hemiLightColorZ: hemiLightColorZ,
      hemiGroundColorX: hemiGroundColorX,
      hemiGroundColorY: hemiGroundColorY,
      hemiGroundColorZ: hemiGroundColorZ,
      hemiPositionX: hemiPositionX,
      hemiPositionY: hemiPositionY,
      hemiPositionZ: hemiPositionZ,
      dirLightIntensity: dirLightIntensity,
      dirLightColorX: dirLightColorX,
      dirLightColorY: dirLightColorY,
      dirLightColorZ: dirLightColorZ,
      dirPositionX: dirPositionX,
      dirPositionY: dirPositionY,
      dirPositionZ: dirPositionZ,
      groundColorX: groundColorX,
      groundColorY: groundColorY,
      groundColorZ: groundColorZ,
      skyOffset: skyOffset,
      skyExponent: skyExponent,
      skySphereGeometryX: skySphereGeometryX,
      skySphereGeometryY: skySphereGeometryY,
      skySphereGeometryZ: skySphereGeometryZ,
      bloomIntensity: bloomIntensity,
      luminanceThreshold: luminanceThreshold,
      luminanceSmoothing: luminanceSmoothing,
      brightness: brightness,
      contrast: contrast,
      hue: hue,
      saturation: saturation,
      sparklesOpacity: sparklesOpacity,
      cloudOpacity: cloudOpacity,
      floatIntensity: floatIntensity,
      parallaxStrength: parallaxStrength,
      vignetteDarkness: vignetteDarkness,
      noiseOpacity: noiseOpacity,
      dofFocusRange: dofFocusRange,
      dofBokehScale: dofBokehScale,
      groundCloudGap: groundCloudGap,
      isNight: isNight,
      overrideScene: overrideScene,
      timeOfDayHour: timeOfDayHour,
      dimmed: dimmed,
      dockLightIntensity: dockLighting.intensity,
      dockLightAngle: dockLighting.angle,
      dockLightDepth: dockLighting.depth,
      dockGlowRadius: dockLighting.glowRadius,
      dockGlowIntensity: dockLighting.glowIntensity,
      streetlampIntensity: streetlampLighting.intensity,
      streetlampAngle: streetlampLighting.angle,
      streetlampTargetDrop: streetlampLighting.targetDrop,
      streetlampTargetForwardOffset: streetlampLighting.targetForwardOffset,
    };

    // Time Option: Override Scene, then Night Mode, then Daytime, in that
    // order. Each control here just mirrors its own React state via
    // setState - none of them reach across to disable/sync the others
    // directly. That cross-wiring instead lives in the syncTimeOptionGui
    // effect below, which re-runs whenever overrideScene/isNight/
    // systemIsDarkMode change and is the single source of truth for what's
    // enabled and what value Night Mode shows. Keeping it there (rather than
    // in these onChange handlers) avoids the stale-closure trap the old
    // version had: createPanel only runs once on mount, so any React state
    // captured directly in these closures would be frozen at its initial
    // value forever.
    timeOptionFolder
      .add(settings, "overrideScene")
      .name("Override Scene")
      .onChange((e: boolean) => setOverrideScene(e));

    nightModeControllerRef.current = timeOptionFolder
      .add(settings, "isNight")
      .name("Night Mode")
      .onChange((e: boolean) => setIsNight(e));

    timeOfDayControllerRef.current = timeOptionFolder
      .add(settings, "timeOfDayHour", 7, 19, 0.25)
      .name("Daytime")
      .onChange((e: number) => setTimeOfDayHour(e));

    dimmedControllerRef.current = timeOptionFolder
      .add(settings, "dimmed")
      .name("Dimmed")
      .onChange((e: boolean) => setDimmed(e));

    ambientLightFolder
      .add(settings, "ambientLightIntensity", 0, 2)
      .name("Intensity")
      .onChange((e: number) => setAmbientLightIntensity(e));
    hemiLightFolder
      .add(settings, "hemiLightIntensity", 0, 4)
      .name("Intensity")
      .onChange((e: number) => setHemiLightIntensity(e));
    hemiLightFolder
      .add(settings, "hemiLightColorX", 0, 1)
      .name("Color X")
      .onChange((e: number) => setHemiLightColorX(e));
    hemiLightFolder
      .add(settings, "hemiLightColorY", 0, 2)
      .name("Color Y")
      .onChange((e: number) => setHemiLightColorY(e));
    hemiLightFolder
      .add(settings, "hemiLightColorZ", 0, 1)
      .name("Color Z")
      .onChange((e: number) => setHemiLightColorZ(e));
    hemiLightFolder
      .add(settings, "hemiGroundColorX", 0, 1)
      .name("Ground Color X")
      .onChange((e: number) => setHemiGroundColorX(e));
    hemiLightFolder
      .add(settings, "hemiGroundColorY", 0, 2)
      .name("Ground Color Y")
      .onChange((e: number) => setHemiGroundColorY(e));
    hemiLightFolder
      .add(settings, "hemiGroundColorZ", 0, 1)
      .name("Ground Color Z")
      .onChange((e: number) => setHemiGroundColorZ(e));
    hemiLightFolder
      .add(settings, "hemiPositionX", -10, 10)
      .name("Position X")
      .onChange((e: number) => setHemiPositionX(e));
    hemiLightFolder
      .add(settings, "hemiPositionY", 0, 100)
      .name("Position Y")
      .onChange((e: number) => setHemiPositionY(e));
    hemiLightFolder
      .add(settings, "hemiPositionZ", -10, 10)
      .name("Position Z")
      .onChange((e: number) => setHemiPositionZ(e));
    dirLightFolder
      .add(settings, "dirLightIntensity", 0, 3.5)
      .name("Intensity")
      .onChange((e: number) => setDirLightIntensity(e));
    dirLightFolder
      .add(settings, "dirLightColorX", 0, 1)
      .name("Color X")
      .onChange((e: number) => setDirLightColorX(e));
    dirLightFolder
      .add(settings, "dirLightColorY", 0, 2)
      .name("Color Y")
      .onChange((e: number) => setDirLightColorY(e));
    dirLightFolder
      .add(settings, "dirLightColorZ", 0, 1)
      .name("Color Z")
      .onChange((e: number) => setDirLightColorZ(e));
    dirLightFolder
      .add(settings, "dirPositionX", -10, 10)
      .name("Position X")
      .onChange((e: number) => setDirPositionX(e));
    dirLightFolder
      .add(settings, "dirPositionY", 0, 100)
      .name("Position Y")
      .onChange((e: number) => setDirPositionY(e));
    dirLightFolder
      .add(settings, "dirPositionZ", -10, 10)
      .name("Position Z")
      .onChange((e: number) => setDirPositionZ(e));
    groundFolder
      .add(settings, "groundColorX", 0, 1)
      .name("Color X")
      .onChange((e: number) => setGroundColorX(e));
    groundFolder
      .add(settings, "groundColorY", 0, 2)
      .name("Color Y")
      .onChange((e: number) => setGroundColorY(e));
    groundFolder
      .add(settings, "groundColorZ", 0, 1)
      .name("Color Z")
      .onChange((e: number) => setGroundColorZ(e));
    skyFolder
      .add(settings, "skyOffset", 0, 100)
      .name("Offset")
      .onChange((e: number) => setSkyOffset(e));
    skyFolder
      .add(settings, "skyExponent", -2, 2)
      .name("Exponent")
      .onChange((e: number) => setSkyExponent(e));
    skyFolder
      .add(settings, "skySphereGeometryX", -500, 500)
      .name("Sphere Geometry X")
      .onChange((e: number) => setSkySphereGeometryX(e));
    skyFolder
      .add(settings, "skySphereGeometryY", -100, 100)
      .name("Sphere Geometry Y")
      .onChange((e: number) => setSkySphereGeometryY(e));
    skyFolder
      .add(settings, "skySphereGeometryZ", -100, 100)
      .name("Sphere Geometry Z")
      .onChange((e: number) => setSkySphereGeometryZ(e));
    atmosphereFolder
      .add(settings, "sparklesOpacity", 0, 1)
      .name("Sparkles Opacity")
      .onChange((e: number) => setSparklesOpacity(e));
    atmosphereFolder
      .add(settings, "cloudOpacity", 0, 1)
      .name("Cloud Opacity")
      .onChange((e: number) => setCloudOpacity(e));
    atmosphereFolder
      .add(settings, "floatIntensity", 0, 10)
      .name("Float Intensity")
      .onChange((e: number) => setFloatIntensity(e));
    atmosphereFolder
      .add(settings, "parallaxStrength", 0, 5)
      .name("Parallax Strength")
      .onChange((e: number) => setParallaxStrength(e));
    atmosphereFolder
      .add(settings, "groundCloudGap", 0, 10)
      .name("Ground/Cloud Gap")
      .onChange((e: number) => setGroundCloudGap(e));
    effectsFolder
      .add(settings, "bloomIntensity", 0, 20)
      .name("Bloom Intensity")
      .onChange((e: number) => setBloomIntensity(e));
    effectsFolder
      .add(settings, "luminanceThreshold", 0, 2)
      .name("Luminance Threshold")
      .onChange((e: number) => setLuminanceThreshold(e));
    effectsFolder
      .add(settings, "luminanceSmoothing", 0, 1)
      .name("Luminance Smoothing")
      .onChange((e: number) => setLuminanceSmoothing(e));
    effectsFolder
      .add(settings, "brightness", -1, 1)
      .name("Brightness")
      .onChange((e: number) => setBrightness(e));
    effectsFolder
      .add(settings, "contrast", -1, 1)
      .name("Contrast")
      .onChange((e: number) => setContrast(e));
    effectsFolder
      .add(settings, "hue", -10, 10)
      .name("Hue")
      .onChange((e: number) => setHue(e));
    effectsFolder
      .add(settings, "saturation", -3, 5)
      .name("Saturation")
      .onChange((e: number) => setSaturation(e));
    effectsFolder
      .add(settings, "vignetteDarkness", 0, 1)
      .name("Vignette Darkness")
      .onChange((e: number) => setVignetteDarkness(e));
    effectsFolder
      .add(settings, "noiseOpacity", 0, 0.2)
      .name("Noise Opacity")
      .onChange((e: number) => setNoiseOpacity(e));
    effectsFolder
      .add(settings, "dofFocusRange", 0.2, 10)
      .name("Focus Range")
      .onChange((e: number) => setDofFocusRange(e));
    effectsFolder
      .add(settings, "dofBokehScale", 0, 10)
      .name("Bokeh Scale")
      .onChange((e: number) => setDofBokehScale(e));

    dockLightingFolder
      .add(settings, "dockLightIntensity", 0, 10)
      .name("Intensity")
      .onChange((e: number) => updateDockLighting("intensity", e));
    dockLightingFolder
      .add(settings, "dockLightAngle", 0.05, 10)
      .name("Beam Angle")
      .onChange((e: number) => updateDockLighting("angle", e));
    dockLightingFolder
      .add(settings, "dockLightDepth", -10, 10)
      .name("Depth Offset")
      .onChange((e: number) => updateDockLighting("depth", e));
    dockLightingFolder
      .add(settings, "dockGlowRadius", 0.05, 10)
      .name("Glow Radius")
      .onChange((e: number) => updateDockLighting("glowRadius", e));
    dockLightingFolder
      .add(settings, "dockGlowIntensity", 0, 10)
      .name("Glow Intensity")
      .onChange((e: number) => updateDockLighting("glowIntensity", e));

    streetlampLightingFolder
      .add(settings, "streetlampIntensity", 0, 1.5)
      .name("Intensity")
      .onChange((e: number) => updateStreetlampLighting("intensity", e));
    streetlampLightingFolder
      .add(settings, "streetlampAngle", 0.05, 1.5)
      .name("Beam Angle")
      .onChange((e: number) => updateStreetlampLighting("angle", e));
    streetlampLightingFolder
      .add(settings, "streetlampTargetDrop", 0, 200)
      .name("Aim Drop")
      .onChange((e: number) => updateStreetlampLighting("targetDrop", e));
    streetlampLightingFolder
      .add(settings, "streetlampTargetForwardOffset", -100, 200)
      .name("Aim Forward Offset")
      .onChange((e: number) =>
        updateStreetlampLighting("targetForwardOffset", e),
      );

    // A subfolder + full set of controls per light, built from whatever
    // sailFloodlights held at mount (the panel is only ever created once).
    sailFloodlights.forEach((light, i) => {
      const lightFolder = sailFloodlightFolder.addFolder(`Light ${i + 1}`);
      const lightSettings = {
        posX: light.position[0],
        posY: light.position[1],
        posZ: light.position[2],
        targetX: light.target[0],
        targetY: light.target[1],
        targetZ: light.target[2],
        angle: light.angle,
        intensity: light.intensity,
      };
      lightFolder
        .add(lightSettings, "posX", -3, 3)
        .name("Position X")
        .onChange((e: number) =>
          updateSailFloodlightVector(i, "position", 0, e),
        );
      lightFolder
        .add(lightSettings, "posY", -1, 2)
        .name("Position Y")
        .onChange((e: number) =>
          updateSailFloodlightVector(i, "position", 1, e),
        );
      lightFolder
        .add(lightSettings, "posZ", -3, 3)
        .name("Position Z")
        .onChange((e: number) =>
          updateSailFloodlightVector(i, "position", 2, e),
        );
      // A spotLight has no rotation of its own - it aims from Position at
      // Target, so these three are effectively the light's "rotation".
      lightFolder
        .add(lightSettings, "targetX", -2, 2)
        .name("Rotation X (target)")
        .onChange((e: number) => updateSailFloodlightVector(i, "target", 0, e));
      lightFolder
        .add(lightSettings, "targetY", -1, 2)
        .name("Rotation Y (target)")
        .onChange((e: number) => updateSailFloodlightVector(i, "target", 1, e));
      lightFolder
        .add(lightSettings, "targetZ", -2, 2)
        .name("Rotation Z (target)")
        .onChange((e: number) => updateSailFloodlightVector(i, "target", 2, e));
      lightFolder
        .add(lightSettings, "angle", 0.01, 1)
        .name("Angle")
        .onChange((e: number) => updateSailFloodlightScalar(i, "angle", e));
      lightFolder
        .add(lightSettings, "intensity", 0, 20)
        .name("Intensity")
        .onChange((e: number) => updateSailFloodlightScalar(i, "intensity", e));
    });
  };

  return (
    <React.Suspense fallback={null}>
      {/* Lights */}
      <ambientLight intensity={effectiveAmbientIntensity} />
      <hemisphereLight
        color={effectiveHemiColor}
        groundColor={effectiveHemiGroundColor}
        intensity={effectiveHemiIntensity}
        position={hemiPosition}
      />
      <directionalLight
        color={effectiveDirColor}
        intensity={effectiveDirIntensity}
        position={effectiveDirPosition}
        castShadow={true}
        // 2048 across a tight +/-5 unit frustum resolves the model far more
        // sharply than 3500 ever did across +/-50, at roughly a third of the
        // shadow-pass texel cost.
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-cameraDirection}
        shadow-camera-right={cameraDirection}
        shadow-camera-top={cameraDirection}
        shadow-camera-bottom={-cameraDirection}
        shadow-camera-far={20}
        shadow-bias={-0.0001}
      />
      {/* Sky */}
      <mesh>
        <sphereGeometry
          args={[skySphereGeometryX, skySphereGeometryY, skySphereGeometryZ]}
        />
        <shaderMaterial
          vertexShader={GLOBAL_VERTEX_SHADER}
          fragmentShader={GLOBAL_FRAGMENT_SHADER}
          uniforms={uniforms}
          side={THREE.BackSide}
        />
      </mesh>
      <Sparkles
        count={
          effectiveIsNight ? 30 : isTwilight ? TWILIGHT_SPARKLES_COUNT : 60
        }
        scale={[4, 2.2, 4]}
        size={effectiveIsNight ? 1.2 : 1.8}
        speed={0.25}
        opacity={
          effectiveIsNight
            ? Math.min(sparklesOpacity, 0.15)
            : isTwilight
              ? Math.min(sparklesOpacity, TWILIGHT_SPARKLE_OPACITY_SCALE)
              : sparklesOpacity * dayLighting.sparkleOpacityScale
        }
        color={
          effectiveIsNight
            ? "#dce8ff"
            : isTwilight
              ? TWILIGHT_SPARKLE_COLOR
              : dayLighting.sparkleColor
        }
        position={[0, 0.6, 0]}
      />
      {effectiveIsNight && (
        <group position={NIGHT_MOON_POSITION}>
          {/* Tone-mapped like everything else - an unclamped, un-tonemapped
              bright point here fed a raw HDR spike into DepthOfField/Bloom
              that showed up as garish rainbow ring artifacts. */}
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color="#eef4ff" />
          </mesh>
          {/* Soft halo so the moon reads as glowing rather than a flat disc. */}
          <mesh scale={2.4}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshBasicMaterial
              color="#cfe0ff"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
      {/* Model */}
      <Float
        speed={1.2}
        rotationIntensity={0}
        floatIntensity={floatIntensity}
        floatingRange={[-0.06, 0.06]}
      >
        <group position={[0, -groundCloudGap, 0]}>
          {/* Atmosphere */}
          {/* Unlit material so the haze reads as the fog/horizon colour itself,
              rather than being tinted by the hemisphere light's blue/orange mix. */}
          <Clouds
            material={THREE.MeshBasicMaterial}
            limit={400}
            texture={cloudTexture}
          >
            <Cloud
              seed={1}
              bounds={[4.5, 0.6, 3.5]}
              volume={5}
              smallestVolume={0.85}
              segments={34}
              color={cloudColor("#ffe3ec")}
              opacity={resolveCloudOpacity(1)}
              fade={2}
              growth={1.5}
              speed={0.08}
              position={[-2.6, -0.15, -1.8]}
            />
            <Cloud
              seed={7}
              bounds={[4.5, 0.6, 3.5]}
              volume={4.6}
              smallestVolume={0.85}
              segments={34}
              color={cloudColor("#ffcad4")}
              opacity={resolveCloudOpacity(0.95)}
              fade={2}
              growth={1.5}
              speed={0.1}
              position={[2.6, -0.25, -2]}
            />
            <Cloud
              seed={13}
              bounds={[4.5, 0.5, 4]}
              volume={4.2}
              smallestVolume={0.85}
              segments={32}
              color={cloudColor("#ffe0c8")}
              opacity={resolveCloudOpacity(0.9)}
              fade={2}
              growth={1.5}
              speed={0.07}
              position={[0.2, -0.35, 2.6]}
            />
            <Cloud
              seed={21}
              bounds={[3.5, 0.5, 3]}
              volume={3.6}
              smallestVolume={0.85}
              segments={28}
              color={cloudColor("#ffb8c6")}
              opacity={resolveCloudOpacity(0.85)}
              fade={2}
              growth={1.5}
              speed={0.09}
              position={[-2, -0.05, 2]}
            />
            <Cloud
              seed={29}
              bounds={[3.5, 0.5, 3]}
              volume={3.6}
              smallestVolume={0.85}
              segments={28}
              color={cloudColor("#fff0e8")}
              opacity={resolveCloudOpacity(0.85)}
              fade={2}
              growth={1.5}
              speed={0.11}
              position={[2.2, 0.05, 1.6]}
            />
            <Cloud
              seed={37}
              bounds={[3.5, 0.45, 3]}
              volume={3.2}
              smallestVolume={0.85}
              segments={26}
              color={cloudColor("#ffcad4")}
              opacity={resolveCloudOpacity(0.8)}
              fade={2}
              growth={1.5}
              speed={0.06}
              position={[0, -0.05, -0.2]}
            />
            <Cloud
              seed={43}
              bounds={[3, 0.4, 2.5]}
              volume={2.8}
              smallestVolume={0.85}
              segments={20}
              color={cloudColor("#ffe0c8")}
              opacity={resolveCloudOpacity(0.7)}
              fade={2}
              growth={1.5}
              speed={0.1}
              position={[-1, -0.15, 0.5]}
            />
            <Cloud
              seed={51}
              bounds={[3, 0.4, 2.5]}
              volume={2.8}
              smallestVolume={0.85}
              segments={20}
              color={cloudColor("#f5c6d6")}
              opacity={resolveCloudOpacity(0.7)}
              fade={2}
              growth={1.5}
              speed={0.12}
              position={[1.2, -0.15, -0.8]}
            />
            {/* Foreground puffs closest to camera, filling the gap at the bottom of frame */}
            <Cloud
              seed={59}
              bounds={[3.5, 0.5, 2]}
              volume={4.2}
              smallestVolume={0.85}
              segments={26}
              color={cloudColor("#ffb8c6")}
              opacity={resolveCloudOpacity(0.9)}
              fade={2}
              growth={1.5}
              speed={0.1}
              position={[-1.5, -0.05, 3.6]}
            />
            <Cloud
              seed={67}
              bounds={[3.5, 0.5, 2]}
              volume={4.2}
              smallestVolume={0.85}
              segments={26}
              color={cloudColor("#ffe3ec")}
              opacity={resolveCloudOpacity(0.9)}
              fade={2}
              growth={1.5}
              speed={0.13}
              position={[1.5, 0.05, 3.8]}
            />
          </Clouds>
        </group>
        <Inspector>
          <Mesh
            sunDirection={effectiveDirPosition}
            isNight={effectiveIsNight}
            sailFloodlights={sailFloodlights}
            dockLighting={dockLighting}
            streetlampLighting={streetlampLighting}
          />
        </Inspector>
      </Float>
      {/* Effects */}
      {/* EffectComposer's children type is JSX.Element | JSX.Element[], not
          ReactNode, so DepthOfField's night-only inclusion below is built as
          an explicit array rather than an inline `{cond && <X/>}` - the
          latter would type as `boolean | Element` and fail to satisfy it. */}
      <EffectComposer>
        {[
          // DepthOfField is one of the most expensive effects in this stack
          // (a full CoC pass plus a multi-tap bokeh blur), and at night it's
          // already tuned to be almost a no-op - focusRange is clamped up to
          // keep nearly everything sharp and bokehScale clamped down to a
          // small blur, specifically to avoid smearing the small hard night
          // glows into rainbow artifacts. Paying full price for a pass whose
          // own tuning makes it barely visible isn't worth it, so it's
          // skipped outright at night rather than just dialed down.
          !effectiveIsNight && (
            <DepthOfField
              key="dof"
              target={[0, 0.45, 0]} // keep the model in focus, let everything else go dreamy
              focusRange={dofFocusRange}
              bokehScale={dofBokehScale}
            />
          ),
          <Bloom
            key="bloom"
            intensity={
              effectiveIsNight ? Math.min(bloomIntensity, 9) : bloomIntensity
            } // The bloom intensity.
            blurPass={undefined} // A blur pass.
            width={Resolution.AUTO_SIZE} // render width
            height={Resolution.AUTO_SIZE} // render height
            kernelSize={effectiveIsNight ? KernelSize.MEDIUM : KernelSize.LARGE} // blur kernel size
            luminanceThreshold={
              effectiveIsNight
                ? Math.max(luminanceThreshold, 1.0)
                : luminanceThreshold
            } // luminance threshold. Raise this value to mask out darker elements in the scene.
            // REFLECT is a steep, non-linear blend - tiny per-frame
            // brightness changes near the threshold (a moving specular
            // hotspot, a bobbing light) swing its output wildly, reading as
            // flicker. ADD is a flat, linear blend that scales smoothly
            // with brightness instead.
            luminanceSmoothing={
              effectiveIsNight
                ? Math.max(luminanceSmoothing, 0.9)
                : luminanceSmoothing
            } // smoothness of the luminance threshold. Range is [0, 1]
            blendFunction={
              effectiveIsNight ? BlendFunction.ADD : BlendFunction.REFLECT
            } // blend mode
          />,
          <BrightnessContrast
            key="brightness-contrast"
            brightness={brightness} // brightness. min: -1, max: 1
            contrast={contrast} // contrast: min -1, max: 1
          />,
          <ColorAverage
            key="color-average"
            blendFunction={BlendFunction.OVERLAY} // blend mode
          />,
          <HueSaturation
            key="hue-saturation"
            blendFunction={BlendFunction.ALPHA} // blend mode
            hue={hue} // hue in radians
            saturation={saturation} // saturation in radians
          />,
          <Vignette
            key="vignette"
            offset={0.3} // vignette offset
            darkness={vignetteDarkness} // vignette darkness
            blendFunction={BlendFunction.NORMAL} // blend mode
          />,
          <Noise
            key="noise"
            opacity={noiseOpacity} // grain opacity
            blendFunction={BlendFunction.OVERLAY} // blend mode
          />,
        ].filter((child): child is React.JSX.Element => Boolean(child))}
      </EffectComposer>
    </React.Suspense>
  );
});

export default SydneyOperaHouse;
