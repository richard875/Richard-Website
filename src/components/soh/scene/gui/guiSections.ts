import type GUI from "lil-gui";
import type { Controller } from "lil-gui";
import type {
  DockLightingConfig,
  SailFloodlightConfig,
  StreetlampLightingConfig,
} from "../../mesh/types";

// The one plain, lil-gui-bound settings object every folder below reads
// its current values from (`.add(settings, key)`) - a flattened mirror of
// Model's gui-related useState values, built fresh every time the panel is
// created (mount only).
export type GuiSettings = {
  ambientLightIntensity: number;
  hemiLightIntensity: number;
  hemiLightColorX: number;
  hemiLightColorY: number;
  hemiLightColorZ: number;
  hemiGroundColorX: number;
  hemiGroundColorY: number;
  hemiGroundColorZ: number;
  hemiPositionX: number;
  hemiPositionY: number;
  hemiPositionZ: number;
  dirLightIntensity: number;
  dirLightColorX: number;
  dirLightColorY: number;
  dirLightColorZ: number;
  dirPositionX: number;
  dirPositionY: number;
  dirPositionZ: number;
  skyOffset: number;
  skyExponent: number;
  skySphereGeometryX: number;
  skySphereGeometryY: number;
  skySphereGeometryZ: number;
  bloomIntensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  sparklesOpacity: number;
  cloudOpacity: number;
  floatIntensity: number;
  parallaxStrength: number;
  vignetteDarkness: number;
  noiseOpacity: number;
  dofFocusRange: number;
  dofBokehScale: number;
  groundCloudGap: number;
  isNight: boolean;
  overrideScene: boolean;
  timeOfDayHour: number;
  dimmed: boolean;
  dockLightIntensity: number;
  dockLightAngle: number;
  dockLightDepth: number;
  dockGlowRadius: number;
  dockGlowIntensity: number;
  streetlampIntensity: number;
  streetlampAngle: number;
  streetlampTargetDrop: number;
  streetlampTargetForwardOffset: number;
};

// Every setState/update function a control below can call - one entry per
// gui control, same names/signatures as Model's own setters.
export type GuiCallbacks = {
  setOverrideScene: (v: boolean) => void;
  setIsNight: (v: boolean) => void;
  setTimeOfDayHour: (v: number) => void;
  setDimmed: (v: boolean) => void;
  setAmbientLightIntensity: (v: number) => void;
  setHemiLightIntensity: (v: number) => void;
  setHemiLightColorX: (v: number) => void;
  setHemiLightColorY: (v: number) => void;
  setHemiLightColorZ: (v: number) => void;
  setHemiGroundColorX: (v: number) => void;
  setHemiGroundColorY: (v: number) => void;
  setHemiGroundColorZ: (v: number) => void;
  setHemiPositionX: (v: number) => void;
  setHemiPositionY: (v: number) => void;
  setHemiPositionZ: (v: number) => void;
  setDirLightIntensity: (v: number) => void;
  setDirLightColorX: (v: number) => void;
  setDirLightColorY: (v: number) => void;
  setDirLightColorZ: (v: number) => void;
  setDirPositionX: (v: number) => void;
  setDirPositionY: (v: number) => void;
  setDirPositionZ: (v: number) => void;
  setSkyOffset: (v: number) => void;
  setSkyExponent: (v: number) => void;
  setSkySphereGeometryX: (v: number) => void;
  setSkySphereGeometryY: (v: number) => void;
  setSkySphereGeometryZ: (v: number) => void;
  setSparklesOpacity: (v: number) => void;
  setCloudOpacity: (v: number) => void;
  setFloatIntensity: (v: number) => void;
  setParallaxStrength: (v: number) => void;
  setGroundCloudGap: (v: number) => void;
  setBloomIntensity: (v: number) => void;
  setLuminanceThreshold: (v: number) => void;
  setLuminanceSmoothing: (v: number) => void;
  setBrightness: (v: number) => void;
  setContrast: (v: number) => void;
  setHue: (v: number) => void;
  setSaturation: (v: number) => void;
  setVignetteDarkness: (v: number) => void;
  setNoiseOpacity: (v: number) => void;
  setDofFocusRange: (v: number) => void;
  setDofBokehScale: (v: number) => void;
  updateDockLighting: (key: keyof DockLightingConfig, value: number) => void;
  updateStreetlampLighting: (
    key: keyof StreetlampLightingConfig,
    value: number,
  ) => void;
  updateSailFloodlightVector: (
    index: number,
    key: "position" | "target",
    axis: 0 | 1 | 2,
    value: number,
  ) => void;
  updateSailFloodlightScalar: (
    index: number,
    key: "angle" | "intensity",
    value: number,
  ) => void;
};

export type TimeOptionControllers = {
  nightModeController: Controller;
  timeOfDayController: Controller;
  dimmedController: Controller;
};

// Time Option: Override Scene, then Night Mode, then Daytime, in that
// order. Each control here just mirrors its own React state via setState -
// none of them reach across to disable/sync the others directly. That
// cross-wiring instead lives in useOperaHouseGuiPanel's sync effect, which
// re-runs whenever overrideScene/isNight/systemIsDarkMode change and is the
// single source of truth for what's enabled and what value Night Mode
// shows. Keeping it there (rather than in these onChange handlers) avoids
// the stale-closure trap the old version had: this function only runs once
// on mount, so any React state captured directly in these closures would be
// frozen at its initial value forever.
export const addTimeOptionControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
): TimeOptionControllers => {
  folder
    .add(settings, "overrideScene")
    .name("Override Scene")
    .onChange(callbacks.setOverrideScene);

  const nightModeController = folder
    .add(settings, "isNight")
    .name("Night Mode")
    .onChange(callbacks.setIsNight);

  const timeOfDayController = folder
    .add(settings, "timeOfDayHour", 7, 19, 0.25)
    .name("Daytime")
    .onChange(callbacks.setTimeOfDayHour);

  const dimmedController = folder
    .add(settings, "dimmed")
    .name("Dimmed")
    .onChange(callbacks.setDimmed);

  return { nightModeController, timeOfDayController, dimmedController };
};

export const addAmbientLightControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "ambientLightIntensity", 0, 2)
    .name("Intensity")
    .onChange(callbacks.setAmbientLightIntensity);
};

export const addHemiLightControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "hemiLightIntensity", 0, 4)
    .name("Intensity")
    .onChange(callbacks.setHemiLightIntensity);
  folder
    .add(settings, "hemiLightColorX", 0, 1)
    .name("Color X")
    .onChange(callbacks.setHemiLightColorX);
  folder
    .add(settings, "hemiLightColorY", 0, 2)
    .name("Color Y")
    .onChange(callbacks.setHemiLightColorY);
  folder
    .add(settings, "hemiLightColorZ", 0, 1)
    .name("Color Z")
    .onChange(callbacks.setHemiLightColorZ);
  folder
    .add(settings, "hemiGroundColorX", 0, 1)
    .name("Ground Color X")
    .onChange(callbacks.setHemiGroundColorX);
  folder
    .add(settings, "hemiGroundColorY", 0, 2)
    .name("Ground Color Y")
    .onChange(callbacks.setHemiGroundColorY);
  folder
    .add(settings, "hemiGroundColorZ", 0, 1)
    .name("Ground Color Z")
    .onChange(callbacks.setHemiGroundColorZ);
  folder
    .add(settings, "hemiPositionX", -10, 10)
    .name("Position X")
    .onChange(callbacks.setHemiPositionX);
  folder
    .add(settings, "hemiPositionY", 0, 100)
    .name("Position Y")
    .onChange(callbacks.setHemiPositionY);
  folder
    .add(settings, "hemiPositionZ", -10, 10)
    .name("Position Z")
    .onChange(callbacks.setHemiPositionZ);
};

export const addDirLightControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "dirLightIntensity", 0, 3.5)
    .name("Intensity")
    .onChange(callbacks.setDirLightIntensity);
  folder
    .add(settings, "dirLightColorX", 0, 1)
    .name("Color X")
    .onChange(callbacks.setDirLightColorX);
  folder
    .add(settings, "dirLightColorY", 0, 2)
    .name("Color Y")
    .onChange(callbacks.setDirLightColorY);
  folder
    .add(settings, "dirLightColorZ", 0, 1)
    .name("Color Z")
    .onChange(callbacks.setDirLightColorZ);
  folder
    .add(settings, "dirPositionX", -10, 10)
    .name("Position X")
    .onChange(callbacks.setDirPositionX);
  folder
    .add(settings, "dirPositionY", 0, 100)
    .name("Position Y")
    .onChange(callbacks.setDirPositionY);
  folder
    .add(settings, "dirPositionZ", -10, 10)
    .name("Position Z")
    .onChange(callbacks.setDirPositionZ);
};

export const addSkyControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "skyOffset", 0, 100)
    .name("Offset")
    .onChange(callbacks.setSkyOffset);
  folder
    .add(settings, "skyExponent", -2, 2)
    .name("Exponent")
    .onChange(callbacks.setSkyExponent);
  folder
    .add(settings, "skySphereGeometryX", -500, 500)
    .name("Sphere Geometry X")
    .onChange(callbacks.setSkySphereGeometryX);
  folder
    .add(settings, "skySphereGeometryY", -100, 100)
    .name("Sphere Geometry Y")
    .onChange(callbacks.setSkySphereGeometryY);
  folder
    .add(settings, "skySphereGeometryZ", -100, 100)
    .name("Sphere Geometry Z")
    .onChange(callbacks.setSkySphereGeometryZ);
};

export const addAtmosphereControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "sparklesOpacity", 0, 1)
    .name("Sparkles Opacity")
    .onChange(callbacks.setSparklesOpacity);
  folder
    .add(settings, "cloudOpacity", 0, 1)
    .name("Cloud Opacity")
    .onChange(callbacks.setCloudOpacity);
  folder
    .add(settings, "floatIntensity", 0, 10)
    .name("Float Intensity")
    .onChange(callbacks.setFloatIntensity);
  folder
    .add(settings, "parallaxStrength", 0, 5)
    .name("Parallax Strength")
    .onChange(callbacks.setParallaxStrength);
  folder
    .add(settings, "groundCloudGap", 0, 10)
    .name("Ground/Cloud Gap")
    .onChange(callbacks.setGroundCloudGap);
};

export const addEffectsControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "bloomIntensity", 0, 20)
    .name("Bloom Intensity")
    .onChange(callbacks.setBloomIntensity);
  folder
    .add(settings, "luminanceThreshold", 0, 2)
    .name("Luminance Threshold")
    .onChange(callbacks.setLuminanceThreshold);
  folder
    .add(settings, "luminanceSmoothing", 0, 1)
    .name("Luminance Smoothing")
    .onChange(callbacks.setLuminanceSmoothing);
  folder
    .add(settings, "brightness", -1, 1)
    .name("Brightness")
    .onChange(callbacks.setBrightness);
  folder
    .add(settings, "contrast", -1, 1)
    .name("Contrast")
    .onChange(callbacks.setContrast);
  folder.add(settings, "hue", -10, 10).name("Hue").onChange(callbacks.setHue);
  folder
    .add(settings, "saturation", -3, 5)
    .name("Saturation")
    .onChange(callbacks.setSaturation);
  folder
    .add(settings, "vignetteDarkness", 0, 1)
    .name("Vignette Darkness")
    .onChange(callbacks.setVignetteDarkness);
  folder
    .add(settings, "noiseOpacity", 0, 0.2)
    .name("Noise Opacity")
    .onChange(callbacks.setNoiseOpacity);
};

export const addDepthOfFieldControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "dofFocusRange", 0.2, 10)
    .name("Focus Range")
    .onChange(callbacks.setDofFocusRange);
  folder
    .add(settings, "dofBokehScale", 0, 10)
    .name("Bokeh Scale")
    .onChange(callbacks.setDofBokehScale);
};

export const addDockLightingControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "dockLightIntensity", 0, 10)
    .name("Intensity")
    .onChange((e: number) => callbacks.updateDockLighting("intensity", e));
  folder
    .add(settings, "dockLightAngle", 0.05, 10)
    .name("Beam Angle")
    .onChange((e: number) => callbacks.updateDockLighting("angle", e));
  folder
    .add(settings, "dockLightDepth", -10, 10)
    .name("Depth Offset")
    .onChange((e: number) => callbacks.updateDockLighting("depth", e));
  folder
    .add(settings, "dockGlowRadius", 0.05, 10)
    .name("Glow Radius")
    .onChange((e: number) => callbacks.updateDockLighting("glowRadius", e));
  folder
    .add(settings, "dockGlowIntensity", 0, 10)
    .name("Glow Intensity")
    .onChange((e: number) => callbacks.updateDockLighting("glowIntensity", e));
};

export const addStreetlampControls = (
  folder: GUI,
  settings: GuiSettings,
  callbacks: GuiCallbacks,
) => {
  folder
    .add(settings, "streetlampIntensity", 0, 1.5)
    .name("Intensity")
    .onChange((e: number) =>
      callbacks.updateStreetlampLighting("intensity", e),
    );
  folder
    .add(settings, "streetlampAngle", 0.05, 1.5)
    .name("Beam Angle")
    .onChange((e: number) => callbacks.updateStreetlampLighting("angle", e));
  folder
    .add(settings, "streetlampTargetDrop", 0, 200)
    .name("Aim Drop")
    .onChange((e: number) =>
      callbacks.updateStreetlampLighting("targetDrop", e),
    );
  folder
    .add(settings, "streetlampTargetForwardOffset", -100, 200)
    .name("Aim Forward Offset")
    .onChange((e: number) =>
      callbacks.updateStreetlampLighting("targetForwardOffset", e),
    );
};

// A subfolder + full set of controls per light, built from whatever
// sailFloodlights held at mount (the panel is only ever created once).
export const addSailFloodlightControls = (
  folder: GUI,
  sailFloodlights: SailFloodlightConfig[],
  callbacks: GuiCallbacks,
) => {
  sailFloodlights.forEach((light, i) => {
    const lightFolder = folder.addFolder(`Light ${i + 1}`);
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
        callbacks.updateSailFloodlightVector(i, "position", 0, e),
      );
    lightFolder
      .add(lightSettings, "posY", -1, 2)
      .name("Position Y")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightVector(i, "position", 1, e),
      );
    lightFolder
      .add(lightSettings, "posZ", -3, 3)
      .name("Position Z")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightVector(i, "position", 2, e),
      );
    // A spotLight has no rotation of its own - it aims from Position at
    // Target, so these three are effectively the light's "rotation".
    lightFolder
      .add(lightSettings, "targetX", -2, 2)
      .name("Rotation X (target)")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightVector(i, "target", 0, e),
      );
    lightFolder
      .add(lightSettings, "targetY", -1, 2)
      .name("Rotation Y (target)")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightVector(i, "target", 1, e),
      );
    lightFolder
      .add(lightSettings, "targetZ", -2, 2)
      .name("Rotation Z (target)")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightVector(i, "target", 2, e),
      );
    lightFolder
      .add(lightSettings, "angle", 0.01, 1)
      .name("Angle")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightScalar(i, "angle", e),
      );
    lightFolder
      .add(lightSettings, "intensity", 0, 20)
      .name("Intensity")
      .onChange((e: number) =>
        callbacks.updateSailFloodlightScalar(i, "intensity", e),
      );
  });
};
