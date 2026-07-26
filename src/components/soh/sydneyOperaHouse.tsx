import React from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
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
import Inspector from "../soh/inspector";
import { INTRO_SOH } from "../../constants/googleTags";
import { DAY_SKY_BOTTOM } from "./scene/lightingKeyframes";
import useDayNightLighting from "./scene/useDayNightLighting";
import useSceneFogSync from "./scene/useSceneFogSync";
import useCameraParallax from "./scene/useCameraParallax";
import SceneLights from "./scene/sceneLights";
import SceneSky from "./scene/sceneSky";
import Moon from "./scene/moon";
import SceneClouds from "./scene/sceneClouds";
import ScenePostProcessing from "./scene/scenePostProcessing";
import useOperaHouseGuiPanel from "./scene/gui/useOperaHouseGuiPanel";

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
    // antialias/stencil are both dropped because EffectComposer (see
    // ScenePostProcessing) owns the actual render targets - the canvas's own
    // default framebuffer is never what ends up on screen, so paying for a
    // multisampled backbuffer and a stencil attachment it never uses is pure
    // waste.
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
  // coordinate arrays in mesh/) plus margin, not the scene's raw
  // (pre-0.0003-scale) gltf units. The previous +/-50 ortho frustum devoted
  // well over 99% of the 3500x3500 shadow map's texels to empty space
  // around the model, which is both wasteful to render and gives the model
  // itself far worse effective shadow resolution than the map size implies.
  const shadowCameraExtent = 5;
  const { scene } = useThree();

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
  // (5pm) keyframe anchor for the time-of-day system (see goldenHourKeyframe
  // in useDayNightLighting), which needs a deterministic starting point to
  // interpolate the sun's arc from/to across the rest of the day.
  const [dirPositionX, setDirPositionX] = React.useState(-6);
  const [dirPositionY, setDirPositionY] = React.useState(1);
  const [dirPositionZ, setDirPositionZ] = React.useState(5);
  // Lowered from 43 alongside the GLOBAL_FRAGMENT_SHADER fix in shader.ts
  // (offset now biases only the sky gradient's Y reference, not X/Z) - with
  // the old X/Z-broadcasting bug, part of this value's "budget" was wasted
  // skewing the gradient off-axis instead of raising it, so the same visual
  // horizon height now needs a smaller number.
  const [skyOffset, setSkyOffset] = React.useState(15);
  const [skyExponent, setSkyExponent] = React.useState(0.6);
  const [skySphereGeometryX, setSkySphereGeometryX] = React.useState(215);
  const [skySphereGeometryY, setSkySphereGeometryY] = React.useState(32);
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
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [isNight, setIsNight] = React.useState(true);
  // Off by default: day/night instead tracks the visitor's OS-level
  // light/dark theme preference (see systemIsDarkMode below). Flipping this
  // on lets the manual "Night Mode" checkbox above take over completely -
  // while off, that checkbox still exists in the GUI but has no effect,
  // since effectiveIsNight (from useDayNightLighting) ignores it entirely.
  const [overrideScene, setOverrideScene] = React.useState(false);
  // Mirrors the OS `prefers-color-scheme` media query. Not routed through
  // the shared useDarkModeManager hook (used elsewhere on this page) -
  // that hook's job also includes driving `document.body.style.
  // backgroundColor`, a side effect this 3D scene has no business
  // triggering a second time.
  const [systemIsDarkMode, setSystemIsDarkMode] = React.useState(true);
  // Manual "Daytime" gui slider (7am-7pm) - only takes effect once Override
  // Scene is on AND Night Mode is off. Otherwise the scene follows the
  // visitor's real local clock.
  const [timeOfDayHour, setTimeOfDayHour] = React.useState(12);
  // Manual "Dimmed" gui checkbox - forces the twilight/"Static Scene" look
  // regardless of the Daytime slider's value. Same enable condition as
  // Daytime itself (Override Scene on, Night Mode off); checking it also
  // disables Daytime, since the hour no longer matters once twilight is
  // being forced.
  const [dimmed, setDimmed] = React.useState(false);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemIsDarkMode = () =>
      setSystemIsDarkMode(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", updateSystemIsDarkMode);
    updateSystemIsDarkMode();
    return () =>
      mediaQueryList.removeEventListener("change", updateSystemIsDarkMode);
  }, []);

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

  // Every dock light shares these same parameters, so unlike sailFloodlights
  // this is one shared config object rather than a per-fixture array.
  const [dockLighting, setDockLighting] = React.useState<DockLightingConfig>(
    DEFAULT_DOCK_LIGHTING,
  );

  const updateDockLighting = (key: keyof DockLightingConfig, value: number) => {
    setDockLighting((prev) => ({ ...prev, [key]: value }));
  };

  // Same shared-config pattern as dockLighting - all 14 streetlamp posts are
  // identical fixtures, so they read from one config object rather than a
  // per-fixture array like sailFloodlights.
  const [streetlampLighting, setStreetlampLighting] =
    React.useState<StreetlampLightingConfig>(DEFAULT_STREETLAMP_LIGHTING);

  const updateStreetlampLighting = (
    key: keyof StreetlampLightingConfig,
    value: number,
  ) => {
    setStreetlampLighting((prev) => ({ ...prev, [key]: value }));
  };

  // All derived day/night lighting state - see scene/useDayNightLighting.ts.
  const {
    effectiveIsNight,
    effectiveHour,
    isTwilight,
    dayLighting,
    dayHemiColor,
    effectiveAmbientIntensity,
    effectiveHemiIntensity,
    effectiveHemiColor,
    effectiveHemiGroundColor,
    effectiveDirIntensity,
    effectiveDirColor,
    effectiveDirPosition,
    cloudColor,
    resolveCloudOpacity,
  } = useDayNightLighting({
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
    overrideScene,
    isNight,
    systemIsDarkMode,
    timeOfDayHour,
    dimmed,
    cloudOpacity,
  });

  // Still used as the sky shader's initial topColor value below and to
  // build the 17:00 keyframe's HSL tuple (see useDayNightLighting) - the
  // actual day/night hemisphere light color is effectiveHemiColor above.
  const hemiLightColor = new THREE.Color();
  hemiLightColor.setHSL(hemiLightColorX, hemiLightColorY, hemiLightColorZ);

  const hemiPosition = new THREE.Vector3(
    hemiPositionX,
    hemiPositionY,
    hemiPositionZ,
  );

  const uniforms = React.useMemo(
    () => ({
      topColor: { value: hemiLightColor },
      bottomColor: { value: DAY_SKY_BOTTOM.clone() },
      offset: { value: skyOffset },
      exponent: { value: skyExponent },
    }),
    [],
  );

  useSceneFogSync(
    scene,
    uniforms,
    effectiveIsNight,
    dayHemiColor,
    dayLighting,
    [
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
    ],
  );

  useOperaHouseGuiPanel({
    values: {
      ambientLightIntensity,
      hemiLightIntensity,
      hemiLightColorX,
      hemiLightColorY,
      hemiLightColorZ,
      hemiGroundColorX,
      hemiGroundColorY,
      hemiGroundColorZ,
      hemiPositionX,
      hemiPositionY,
      hemiPositionZ,
      dirLightIntensity,
      dirLightColorX,
      dirLightColorY,
      dirLightColorZ,
      dirPositionX,
      dirPositionY,
      dirPositionZ,
      skyOffset,
      skyExponent,
      skySphereGeometryX,
      skySphereGeometryY,
      skySphereGeometryZ,
      bloomIntensity,
      luminanceThreshold,
      luminanceSmoothing,
      brightness,
      contrast,
      hue,
      saturation,
      sparklesOpacity,
      cloudOpacity,
      floatIntensity,
      parallaxStrength,
      vignetteDarkness,
      noiseOpacity,
      dofFocusRange,
      dofBokehScale,
      groundCloudGap,
      autoRotate,
      isNight,
      overrideScene,
      timeOfDayHour,
      dimmed,
      systemIsDarkMode,
      effectiveIsNight,
    },
    callbacks: {
      setOverrideScene,
      setIsNight,
      setTimeOfDayHour,
      setDimmed,
      setAmbientLightIntensity,
      setHemiLightIntensity,
      setHemiLightColorX,
      setHemiLightColorY,
      setHemiLightColorZ,
      setHemiGroundColorX,
      setHemiGroundColorY,
      setHemiGroundColorZ,
      setHemiPositionX,
      setHemiPositionY,
      setHemiPositionZ,
      setDirLightIntensity,
      setDirLightColorX,
      setDirLightColorY,
      setDirLightColorZ,
      setDirPositionX,
      setDirPositionY,
      setDirPositionZ,
      setSkyOffset,
      setSkyExponent,
      setSkySphereGeometryX,
      setSkySphereGeometryY,
      setSkySphereGeometryZ,
      setSparklesOpacity,
      setCloudOpacity,
      setFloatIntensity,
      setParallaxStrength,
      setGroundCloudGap,
      setAutoRotate,
      setBloomIntensity,
      setLuminanceThreshold,
      setLuminanceSmoothing,
      setBrightness,
      setContrast,
      setHue,
      setSaturation,
      setVignetteDarkness,
      setNoiseOpacity,
      setDofFocusRange,
      setDofBokehScale,
      updateDockLighting,
      updateStreetlampLighting,
      updateSailFloodlightVector,
      updateSailFloodlightScalar,
    },
    sailFloodlights,
    dockLighting,
    streetlampLighting,
  });

  useCameraParallax(parallaxStrength);

  return (
    <React.Suspense fallback={null}>
      {/* Lights */}
      <SceneLights
        ambientIntensity={effectiveAmbientIntensity}
        hemiColor={effectiveHemiColor}
        hemiGroundColor={effectiveHemiGroundColor}
        hemiIntensity={effectiveHemiIntensity}
        hemiPosition={hemiPosition}
        dirColor={effectiveDirColor}
        dirIntensity={effectiveDirIntensity}
        dirPosition={effectiveDirPosition}
        shadowCameraExtent={shadowCameraExtent}
      />
      {/* Sky */}
      <SceneSky
        uniforms={uniforms}
        skySphereGeometryX={
          effectiveIsNight ? skySphereGeometryX : dayLighting.skySphereGeometryX
        }
        skySphereGeometryY={skySphereGeometryY}
        skySphereGeometryZ={skySphereGeometryZ}
        effectiveIsNight={effectiveIsNight}
        sparklesOpacity={sparklesOpacity}
        dayLighting={dayLighting}
      />
      {effectiveIsNight && <Moon />}
      {/* Model */}
      <Float
        speed={1.2}
        rotationIntensity={0}
        floatIntensity={floatIntensity}
        floatingRange={[-0.06, 0.06]}
      >
        <group position={[0, -groundCloudGap, 0]}>
          {/* Atmosphere */}
          <SceneClouds
            cloudColor={cloudColor}
            resolveCloudOpacity={resolveCloudOpacity}
          />
        </group>
        <Inspector autoRotate={autoRotate}>
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
      <ScenePostProcessing
        effectiveIsNight={effectiveIsNight}
        bloomIntensity={bloomIntensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        brightness={brightness}
        contrast={contrast}
        hue={hue}
        saturation={saturation}
        vignetteDarkness={vignetteDarkness}
        noiseOpacity={noiseOpacity}
        dofFocusRange={dofFocusRange}
        dofBokehScale={dofBokehScale}
      />
    </React.Suspense>
  );
});

export default SydneyOperaHouse;
