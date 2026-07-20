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
import { KernelSize, BlendFunction } from "postprocessing";
import Mesh, { DEFAULT_SAIL_FLOODLIGHTS, DEFAULT_DOCK_LIGHTING } from "./mesh";
import type { SailFloodlightConfig, DockLightingConfig } from "./mesh";
import Inspector from "./inspector";
import { IS_DEV } from "../../constants/environment";
import { INTRO_SOH } from "../../constants/googleTags";
import { GLOBAL_VERTEX_SHADER, GLOBAL_FRAGMENT_SHADER } from "./shader";
import cloudTexture from "../../../static/models/sydneyOperaHouse/cloud.png";

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

const SydneyOperaHouse = React.memo(() => (
  <Canvas
    id={`${INTRO_SOH}_2`}
    className="canvas"
    shadows
    legacy={true}
    // No dpr prop meant R3F defaulted to [1, 2], i.e. matching a retina
    // display's full 2x device pixel ratio - every per-fragment cost in the
    // scene (dozens of dynamic lights, the postprocessing stack) was being
    // paid across 4x as many pixels as necessary. With ~74 real lights back
    // in the scene (see mesh.tsx), that multiplier matters a lot more than
    // it did with a handful of lights, so this is capped at a flat 1 - no
    // supersampling at all - rather than the 1.5 it was before. Softening
    // is barely noticeable once composited through Bloom/grain/vignette.
    dpr={1}
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
  const [dirPositionX, setDirPositionX] = React.useState(
    Math.random() * 20 - 10,
  );
  const [dirPositionY, setDirPositionY] = React.useState(1);
  const [dirPositionZ, setDirPositionZ] = React.useState(
    Math.floor(Math.random() * 10) + 1,
  );
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

  // Lights
  const hemiLightColor = new THREE.Color();
  hemiLightColor.setHSL(hemiLightColorX, hemiLightColorY, hemiLightColorZ);

  const hemiGroundColor = new THREE.Color();
  hemiGroundColor.setHSL(hemiGroundColorX, hemiGroundColorY, hemiGroundColorZ);

  const hemiPosition = new THREE.Vector3(
    hemiPositionX,
    hemiPositionY,
    hemiPositionZ,
  );

  const dirLightColor = new THREE.Color();
  dirLightColor.setHSL(dirLightColorX, dirLightColorY, dirLightColorZ);

  const dirPosition = new THREE.Vector3(
    dirPositionX,
    dirPositionY,
    dirPositionZ,
  );

  // Ground
  const groundColor = new THREE.Color();
  groundColor.setHSL(groundColorX, groundColorY, groundColorZ);

  // Night mode swaps in fixed lighting/atmosphere values instead of the day
  // gui sliders above, so toggling it never disturbs the day-tuned values.
  const effectiveAmbientIntensity = isNight
    ? NIGHT_AMBIENT_INTENSITY
    : ambientLightIntensity;
  const effectiveHemiIntensity = isNight
    ? NIGHT_HEMI_INTENSITY
    : hemiLightIntensity;
  const effectiveHemiColor = isNight ? NIGHT_HEMI_COLOR : hemiLightColor;
  const effectiveHemiGroundColor = isNight
    ? NIGHT_HEMI_GROUND_COLOR
    : hemiGroundColor;
  const effectiveDirIntensity = isNight
    ? NIGHT_DIR_INTENSITY
    : dirLightIntensity;
  const effectiveDirColor = isNight ? NIGHT_DIR_COLOR : dirLightColor;
  // Fixed moon position at night instead of the day light's randomized spot,
  // so the visible moon disc and the water's moon-glint always agree.
  const effectiveDirPosition = isNight ? NIGHT_MOON_POSITION : dirPosition;

  // The Cloud puffs are unlit, so night-dimming them means swapping their
  // color/opacity directly rather than relying on scene light intensity.
  const cloudColor = (dayColor: string) =>
    isNight ? NIGHT_CLOUD_COLOR : dayColor;
  const resolveCloudOpacity = (mult: number) =>
    cloudOpacity * mult * (isNight ? NIGHT_CLOUD_OPACITY_SCALE : 1);

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
    if (IS_DEV) createPanel();
  }, []);

  // Swap the sky/fog palette and distances when night mode toggles. Fog and
  // background share the same Color instance (assigned above), so mutating
  // it here keeps the horizon and the fog blending seamlessly either way.
  React.useEffect(() => {
    if (!scene.fog) return;
    uniforms.topColor.value.copy(isNight ? NIGHT_SKY_TOP : hemiLightColor);
    uniforms.bottomColor.value.copy(
      isNight ? NIGHT_SKY_BOTTOM : DAY_SKY_BOTTOM,
    );
    scene.fog.color.copy(uniforms.bottomColor.value);
    (scene.fog as THREE.Fog).near = isNight ? NIGHT_FOG_NEAR : DAY_FOG_NEAR;
    (scene.fog as THREE.Fog).far = isNight ? NIGHT_FOG_FAR : DAY_FOG_FAR;
  }, [isNight]);

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
    const nightFolder = panel.addFolder("Night Mode");
    const sailFloodlightFolder = panel.addFolder("Sail Floodlights");
    const dockLightingFolder = panel.addFolder("Dock Lights");
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
      dockLightIntensity: dockLighting.intensity,
      dockLightAngle: dockLighting.angle,
      dockLightDepth: dockLighting.depth,
      dockGlowRadius: dockLighting.glowRadius,
      dockGlowIntensity: dockLighting.glowIntensity,
    };

    nightFolder
      .add(settings, "isNight")
      .name("Night Mode")
      .onChange((e: boolean) => setIsNight(e));

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
        count={isNight ? 30 : 60}
        scale={[4, 2.2, 4]}
        size={isNight ? 1.2 : 1.8}
        speed={0.25}
        opacity={isNight ? Math.min(sparklesOpacity, 0.15) : sparklesOpacity}
        color={isNight ? "#dce8ff" : "#fff3e0"}
        position={[0, 0.6, 0]}
      />
      {isNight && (
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
            isNight={isNight}
            sailFloodlights={sailFloodlights}
            dockLighting={dockLighting}
          />
        </Inspector>
      </Float>
      {/* Effects */}
      {/* multisampling defaults to 8x MSAA - expensive on its own, and
          largely wasted here: every edge it would smooth gets run straight
          through DepthOfField/Bloom's blur and then Noise's grain anyway,
          so the antialiasing it buys is barely visible in the final
          composite.
          EffectComposer's children type is JSX.Element | JSX.Element[], not
          ReactNode, so DepthOfField's night-only inclusion below is built as
          an explicit array rather than an inline `{cond && <X/>}` - the
          latter would type as `boolean | Element` and fail to satisfy it. */}
      <EffectComposer multisampling={0}>
        {[
          // DepthOfField is one of the most expensive effects in this stack
          // (a full CoC pass plus a multi-tap bokeh blur), and at night it's
          // already tuned to be almost a no-op - focusRange is clamped up to
          // keep nearly everything sharp and bokehScale clamped down to a
          // small blur, specifically to avoid smearing the small hard night
          // glows into rainbow artifacts. Paying full price for a pass whose
          // own tuning makes it barely visible isn't worth it, so it's
          // skipped outright at night rather than just dialed down.
          !isNight && (
            <DepthOfField
              key="dof"
              target={[0, 0.45, 0]} // keep the model in focus, let everything else go dreamy
              focusRange={dofFocusRange}
              bokehScale={dofBokehScale}
            />
          ),
          <Bloom
            key="bloom"
            intensity={isNight ? Math.min(bloomIntensity, 9) : bloomIntensity} // The bloom intensity.
            blurPass={undefined} // A blur pass.
            // A fixed, moderate resolution instead of AUTO_SIZE (which
            // tracks the full canvas size) keeps Bloom's internal
            // downsample/blur chain cheap regardless of how large the
            // canvas renders - a soft glow doesn't need to be computed at
            // full resolution to read the same once composited back over
            // the sharp base image.
            width={480}
            height={480}
            kernelSize={isNight ? KernelSize.MEDIUM : KernelSize.LARGE} // blur kernel size
            luminanceThreshold={
              isNight ? Math.max(luminanceThreshold, 1.0) : luminanceThreshold
            } // luminance threshold. Raise this value to mask out darker elements in the scene.
            // REFLECT is a steep, non-linear blend - tiny per-frame
            // brightness changes near the threshold (a moving specular
            // hotspot, a bobbing light) swing its output wildly, reading as
            // flicker. ADD is a flat, linear blend that scales smoothly
            // with brightness instead.
            luminanceSmoothing={
              isNight ? Math.max(luminanceSmoothing, 0.9) : luminanceSmoothing
            } // smoothness of the luminance threshold. Range is [0, 1]
            blendFunction={isNight ? BlendFunction.ADD : BlendFunction.REFLECT} // blend mode
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
