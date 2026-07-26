import * as THREE from "three";

// Fixed night-mode tuning, kept separate from the day gui sliders so flipping
// "Night Mode" doesn't disturb the day look those sliders control.
// Ambient/hemisphere are the flat, shadowless "atmosphere" fill - at night
// that fill should be next to nothing, barely above zero. The moon
// (directional light) is the one light meant to actually illuminate the
// scene, strong enough to visibly light up the model's upward-facing
// surfaces on its own; the streetlamps/window glows and sail floodlights
// layer on top of that for local detail.
export const NIGHT_AMBIENT_INTENSITY = 0.003 * Math.PI;
export const NIGHT_HEMI_INTENSITY = 0.004 * Math.PI;
export const NIGHT_HEMI_COLOR = new THREE.Color("#3a4a7a");
export const NIGHT_HEMI_GROUND_COLOR = new THREE.Color("#0c1020");
export const NIGHT_DIR_INTENSITY = 0.65 * Math.PI;
export const NIGHT_DIR_COLOR = new THREE.Color("#dce6ff");
// Moon direction/position: fixed (unlike the day light's randomized spot) so
// the water's moon-glint and the visible moon disc always agree.
export const NIGHT_MOON_POSITION = new THREE.Vector3(5, 9, -6);
export const NIGHT_SKY_TOP = new THREE.Color("#020305");
export const NIGHT_SKY_BOTTOM = new THREE.Color("#0a0e1c");
// The background Cloud puffs use an unlit MeshBasicMaterial, so they render
// at their own flat color regardless of how dim the scene lights are -
// dropping ambient/hemisphere intensity does nothing to them. To make them
// recede into the night background they need their own dark color and a
// much lower opacity, applied directly.
export const NIGHT_CLOUD_COLOR = "#141a30";
export const NIGHT_CLOUD_OPACITY_SCALE = 0.35;
export const NIGHT_FOG_NEAR = 1;
export const NIGHT_FOG_FAR = 24;
export const DAY_SKY_BOTTOM = new THREE.Color(0xfad6a5);
export const DAY_FOG_NEAR = 0.5;
export const DAY_FOG_FAR = 18;

// Time-of-day tuning (7am-7pm), used whenever the scene is in day mode (see
// effectiveIsNight in useDayNightLighting). One keyframe per anchor hour;
// render values in between are linearly interpolated (see
// interpolateDayLighting below), so dragging the "Time of Day" gui slider -
// or just leaving the tab open across real time - sweeps smoothly through
// the whole set rather than jumping between fixed looks. The 17:00 (5pm)
// keyframe deliberately isn't listed here - it's built from the existing
// Ambient/Hemi/Direct Light gui slider state instead (see
// goldenHourKeyframe in useDayNightLighting), which is exactly the
// warm/golden look this scene originally shipped with (and is what the gui
// sliders already default to) - reusing it keeps those sliders live rather
// than leaving them dead once time-of-day drives the render.
export type TimeLightingKeyframe = {
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
  // Radius of the sky sphere (see skySphereGeometryX in sydneyOperaHouse.tsx
  // and GLOBAL_FRAGMENT_SHADER in shader.ts). The gradient's fixed `offset`
  // biases the shader's height reference by a constant amount regardless of
  // sphere size, so shrinking the radius alone (without touching `offset`)
  // makes that same constant a much larger fraction of the sphere's scale,
  // pushing far more of the dome into the topColor end of the gradient.
  // MORNING/NOON use this to read as a dominant blue sky without changing
  // `offset`/`exponent` globally and disturbing every other hour (and night)
  // that already looks right.
  skySphereGeometryX: number;
  // 0 = fully desaturated toward NEUTRAL_CLOUD_COLOR (crisp midday cloud),
  // 1 = the cloud's own hard-coded pink/peach hex prop, unchanged (see
  // applyCloudWarmth/cloudColor in useDayNightLighting).
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
// postprocessing hue rotation (HueSaturation's `hue` gui slider, 6 radians
// =~ -16.2deg, tuned around that one 0.62 value) was pulling any lower hue
// down into cyan/turquoise territory instead of blue once rotated, which is
// what actually made 9am-3pm look wrong.
export const DAWN_KEYFRAME: TimeLightingKeyframe = {
  hour: 7,
  ambientIntensity: 0.18 * Math.PI,
  hemiIntensity: 0.75 * Math.PI,
  hemiColorHSL: [0.62, 0.72, 0.58],
  hemiGroundColorHSL: [0.07, 0.62, 0.58],
  dirIntensity: 0.44 * Math.PI,
  dirColorHSL: [0.06, 0.7, 0.78],
  dirPosition: [7, 1.2, 4],
  skyBottom: 0xe0a6d2,
  fogNear: 0.7,
  fogFar: 19,
  skySphereGeometryX: 215,
  cloudWarmth: 0.4,
  sparkleColor: "#b6ffe2",
  sparkleOpacityScale: 0.9,
};
export const MORNING_KEYFRAME: TimeLightingKeyframe = {
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
  skySphereGeometryX: 25,
  cloudWarmth: 0.55,
  sparkleColor: "#fff2d9",
  sparkleOpacityScale: 0.9,
};
// (hemiColorHSL hue pinned to 0.62 here too - see the comment above DAWN.)
// The sun position here (and at 15:00 below) deliberately keeps a strong
// horizontal offset rather than swinging up toward vertical - a near-
// overhead light was hitting the glass roof material (near-mirror, 0.08
// roughness in day mode - see useGlassMaterial in mesh/materials.ts) at
// close to normal incidence, mirror-reflecting the light straight at the
// camera and blowing Bloom out into a solid white blob across the sails.
// Keeping the elevation modest and the horizontal component large avoids
// that hotspot angle entirely while still reading as "midday" through
// color/brightness alone.
export const NOON_KEYFRAME: TimeLightingKeyframe = {
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
  skySphereGeometryX: 25,
  cloudWarmth: 0.45,
  sparkleColor: "#fff8e6",
  sparkleOpacityScale: 1,
};
export const AFTERNOON_KEYFRAME: TimeLightingKeyframe = {
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
  skySphereGeometryX: 25,
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
export const DUSK_KEYFRAME: TimeLightingKeyframe = {
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
  skySphereGeometryX: 215,
  cloudWarmth: 1,
  sparkleColor: "#ffcf8a",
  sparkleOpacityScale: 0.8,
};

// The one static "outside daylight hours" look used whenever the OS/browser
// theme is light but the real clock (or the overridden time slider) falls
// before 7am or at/after 7pm - see isTwilight in useDayNightLighting.
// Deliberately just another keyframe fed through the exact same
// interpolateDayLighting pipeline as every real daytime hour (see
// dayKeyframes in useDayNightLighting), rather than a separately hand-tuned
// set of raw THREE.Color/Vector3 constants. An earlier version used the
// latter - independently-authored numbers that were individually close to
// DUSK_KEYFRAME's - and it still rendered as a garish, oversaturated
// red/magenta wash completely unlike 19:00, because this scene's fixed
// Bloom/ColorAverage/HueSaturation postprocessing chain is only ever
// verified against colors that actually flow through the real day pipeline;
// small deltas authored outside it land in un-vetted territory and can come
// out looking nothing like intended. Routing "Dimmed" through
// interpolateDayLighting at hour 19.5 (see lightingHour in
// useDayNightLighting) guarantees it's built from values that pipeline has
// already rendered correctly one keyframe earlier, just carried one small,
// same-shaped step further - same hue/saturation as DUSK_KEYFRAME
// throughout, only intensity and lightness stepped down a little more (see
// the DUSK_KEYFRAME comment on why saturation must never drop on its own).
export const DIMMED_KEYFRAME: TimeLightingKeyframe = {
  hour: 19.5,
  ambientIntensity: DUSK_KEYFRAME.ambientIntensity * 0.85,
  hemiIntensity: DUSK_KEYFRAME.hemiIntensity * 0.85,
  hemiColorHSL: [0.62, 1, 0.37],
  hemiGroundColorHSL: [0.095, 1, 0.44],
  dirIntensity: DUSK_KEYFRAME.dirIntensity * 0.85,
  dirColorHSL: [0.1, 1, 0.69],
  dirPosition: DUSK_KEYFRAME.dirPosition,
  skyBottom: 0xd18951,
  fogNear: DUSK_KEYFRAME.fogNear,
  fogFar: DUSK_KEYFRAME.fogFar,
  skySphereGeometryX: DUSK_KEYFRAME.skySphereGeometryX,
  cloudWarmth: 1,
  sparkleColor: DUSK_KEYFRAME.sparkleColor,
  sparkleOpacityScale: DUSK_KEYFRAME.sparkleOpacityScale * 0.9,
};

// Pale, cool near-white the day clouds desaturate toward at cloudWarmth=0
// (crisp midday puffs) before blending back up to each cloud's own hard-
// coded pink/peach hex at cloudWarmth=1 (golden hour, unchanged from today).
export const NEUTRAL_CLOUD_COLOR = new THREE.Color("#f5f9ff");

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
// `hour` is clamped to the keyframe span rather than wrapping. The Daytime
// gui slider only ever calls this with hours in [7, 19]; isTwilight (see
// useDayNightLighting) reaches the trailing DIMMED_KEYFRAME segment by
// passing 19.5 explicitly via lightingHour, not by the real clock drifting
// past 19.
export const interpolateDayLighting = (
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
    skySphereGeometryX: THREE.MathUtils.lerp(
      lower.skySphereGeometryX,
      upper.skySphereGeometryX,
      t,
    ),
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
