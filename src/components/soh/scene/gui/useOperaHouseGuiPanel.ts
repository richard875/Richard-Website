import React from "react";
import GUI from "lil-gui";
import { IS_DEV } from "../../../../constants/environment";
import type {
  DockLightingConfig,
  SailFloodlightConfig,
  StreetlampLightingConfig,
} from "../../mesh/types";
import {
  addAmbientLightControls,
  addAtmosphereControls,
  addDepthOfFieldControls,
  addDirLightControls,
  addDockLightingControls,
  addEffectsControls,
  addHemiLightControls,
  addSailFloodlightControls,
  addSkyControls,
  addStreetlampControls,
  addTimeOptionControls,
} from "./guiSections";
import type { GuiCallbacks, GuiSettings } from "./guiSections";

export type GuiPanelValues = Omit<
  GuiSettings,
  | "dockLightIntensity"
  | "dockLightAngle"
  | "dockLightDepth"
  | "dockGlowRadius"
  | "dockGlowIntensity"
  | "streetlampIntensity"
  | "streetlampAngle"
  | "streetlampTargetDrop"
  | "streetlampTargetForwardOffset"
> & {
  systemIsDarkMode: boolean;
  effectiveIsNight: boolean;
};

// Builds the lil-gui panel once on mount (dev, or `#debug` in prod) and
// keeps the Time Option folder's enabled/disabled state and the Day/Night
// Scene Options folders' visibility in sync with React state afterwards.
// See guiSections.ts for what each folder actually contains.
const useOperaHouseGuiPanel = ({
  values,
  callbacks,
  sailFloodlights,
  dockLighting,
  streetlampLighting,
}: {
  values: GuiPanelValues;
  callbacks: GuiCallbacks;
  sailFloodlights: SailFloodlightConfig[];
  dockLighting: DockLightingConfig;
  streetlampLighting: StreetlampLightingConfig;
}) => {
  // Handles to the gui's Night Mode/Daytime/Dimmed controllers and the Day/
  // Night Scene Options folders, set once below when the panel is created -
  // kept in refs (not local consts) so the sync effect further down can
  // imperatively re-disable/re-value/show/hide them whenever
  // overrideScene/isNight/systemIsDarkMode/dimmed change, without needing
  // the panel itself to ever be rebuilt.
  const nightModeControllerRef = React.useRef<any>(null);
  const timeOfDayControllerRef = React.useRef<any>(null);
  const dimmedControllerRef = React.useRef<any>(null);
  const daySceneOptionsFolderRef = React.useRef<any>(null);
  const nightSceneOptionsFolderRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!(IS_DEV || window.location.hash === "#debug")) return;

    const panel = new GUI({ width: 310 });
    const timeOptionFolder = panel.addFolder("Time Option");
    const skyFolder = panel.addFolder("Sky").close();
    const atmosphereFolder = panel.addFolder("Atmosphere").close();
    const effectsFolder = panel.addFolder("Effects").close();
    const daySceneOptionsFolder = panel.addFolder("Day Scene Options").close();
    daySceneOptionsFolderRef.current = daySceneOptionsFolder;
    const ambientLightFolder = daySceneOptionsFolder
      .addFolder("Ambient Light")
      .close();
    const hemiLightFolder = daySceneOptionsFolder
      .addFolder("Hemi Light")
      .close();
    const dirLightFolder = daySceneOptionsFolder
      .addFolder("Direct Light")
      .close();
    // Focus Range/Bokeh Scale are day-only - DepthOfField is skipped
    // entirely at night (see ScenePostProcessing) - so they belong here
    // with the other day-only options rather than in Effects.
    const depthOfFieldFolder = daySceneOptionsFolder
      .addFolder("Depth of Field")
      .close();
    const nightSceneOptionsFolder = panel
      .addFolder("Night Scene Options")
      .close();
    nightSceneOptionsFolderRef.current = nightSceneOptionsFolder;
    const sailFloodlightFolder = nightSceneOptionsFolder
      .addFolder("Sail Floodlights")
      .close();
    const dockLightingFolder = nightSceneOptionsFolder
      .addFolder("Dock Lights")
      .close();
    const streetlampLightingFolder = nightSceneOptionsFolder
      .addFolder("Streetlamp Lights")
      .close();
    panel.close();

    // Position the lil-gui panel at the top-left so it doesn't block the view
    (panel as any).domElement.style.position = "absolute";
    (panel as any).domElement.style.top = "0px";
    (panel as any).domElement.style.left = "30px";
    (panel as any).domElement.style.right = "auto";
    (panel as any).domElement.style.zIndex = "1000";
    (panel as any).domElement.style.border = "1px solid #ccc";

    const settings: GuiSettings = {
      ambientLightIntensity: values.ambientLightIntensity,
      hemiLightIntensity: values.hemiLightIntensity,
      hemiLightColorX: values.hemiLightColorX,
      hemiLightColorY: values.hemiLightColorY,
      hemiLightColorZ: values.hemiLightColorZ,
      hemiGroundColorX: values.hemiGroundColorX,
      hemiGroundColorY: values.hemiGroundColorY,
      hemiGroundColorZ: values.hemiGroundColorZ,
      hemiPositionX: values.hemiPositionX,
      hemiPositionY: values.hemiPositionY,
      hemiPositionZ: values.hemiPositionZ,
      dirLightIntensity: values.dirLightIntensity,
      dirLightColorX: values.dirLightColorX,
      dirLightColorY: values.dirLightColorY,
      dirLightColorZ: values.dirLightColorZ,
      dirPositionX: values.dirPositionX,
      dirPositionY: values.dirPositionY,
      dirPositionZ: values.dirPositionZ,
      skyOffset: values.skyOffset,
      skyExponent: values.skyExponent,
      skySphereGeometryX: values.skySphereGeometryX,
      skySphereGeometryY: values.skySphereGeometryY,
      skySphereGeometryZ: values.skySphereGeometryZ,
      bloomIntensity: values.bloomIntensity,
      luminanceThreshold: values.luminanceThreshold,
      luminanceSmoothing: values.luminanceSmoothing,
      brightness: values.brightness,
      contrast: values.contrast,
      hue: values.hue,
      saturation: values.saturation,
      sparklesOpacity: values.sparklesOpacity,
      cloudOpacity: values.cloudOpacity,
      floatIntensity: values.floatIntensity,
      parallaxStrength: values.parallaxStrength,
      vignetteDarkness: values.vignetteDarkness,
      noiseOpacity: values.noiseOpacity,
      dofFocusRange: values.dofFocusRange,
      dofBokehScale: values.dofBokehScale,
      groundCloudGap: values.groundCloudGap,
      isNight: values.isNight,
      overrideScene: values.overrideScene,
      timeOfDayHour: values.timeOfDayHour,
      dimmed: values.dimmed,
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

    const { nightModeController, timeOfDayController, dimmedController } =
      addTimeOptionControls(timeOptionFolder, settings, callbacks);
    nightModeControllerRef.current = nightModeController;
    timeOfDayControllerRef.current = timeOfDayController;
    dimmedControllerRef.current = dimmedController;

    addAmbientLightControls(ambientLightFolder, settings, callbacks);
    addHemiLightControls(hemiLightFolder, settings, callbacks);
    addDirLightControls(dirLightFolder, settings, callbacks);
    addSkyControls(skyFolder, settings, callbacks);
    addAtmosphereControls(atmosphereFolder, settings, callbacks);
    addEffectsControls(effectsFolder, settings, callbacks);
    addDepthOfFieldControls(depthOfFieldFolder, settings, callbacks);
    addDockLightingControls(dockLightingFolder, settings, callbacks);
    addStreetlampControls(streetlampLightingFolder, settings, callbacks);
    addSailFloodlightControls(sailFloodlightFolder, sailFloodlights, callbacks);

    return () => {
      panel.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keeps the Time Option gui in sync with overrideScene/isNight/
  // systemIsDarkMode/dimmed - the single place that decides what's enabled
  // and what Night Mode displays, since the mount effect above only runs
  // once and never sees later state changes on its own.
  React.useEffect(() => {
    const nightModeController = nightModeControllerRef.current;
    const timeOfDayController = timeOfDayControllerRef.current;
    const dimmedController = dimmedControllerRef.current;
    if (!nightModeController || !timeOfDayController || !dimmedController)
      return;

    nightModeController.disable(!values.overrideScene);
    if (!values.overrideScene) {
      // Not overridden - Night Mode is just a (disabled) readout of the OS
      // theme. Going through setValue (rather than mutating the bound
      // settings object directly) also fires its onChange, which keeps the
      // `isNight` React state seeded with the current OS value - so the
      // moment Override Scene does get checked, Night Mode starts already
      // matching whatever the OS currently says instead of some stale value.
      nightModeController.setValue(values.systemIsDarkMode);
    }

    // Dimmed shares Daytime's base gate (Override Scene on, Night Mode
    // off) - initially disabled (Override Scene starts unchecked), and
    // disabled again the instant Night Mode is checked.
    const baseDisabled = !values.overrideScene || values.isNight;
    dimmedController.disable(baseDisabled);

    // Daytime only takes over from the real clock once you've explicitly
    // opted into manual control (Override Scene) AND Night Mode is off, AND
    // additionally disabled whenever Dimmed is forcing the twilight/"Static
    // Scene" look instead - the hour no longer matters once that's active.
    timeOfDayController.disable(baseDisabled || values.dimmed);

    // Day Scene Options (including its nested Depth of Field subfolder) is
    // only relevant while the day pipeline is actually rendering; Night
    // Scene Options only while night mode is.
    daySceneOptionsFolderRef.current?.show(!values.effectiveIsNight);
    nightSceneOptionsFolderRef.current?.show(values.effectiveIsNight);
  }, [
    values.overrideScene,
    values.isNight,
    values.systemIsDarkMode,
    values.dimmed,
  ]);
};

export default useOperaHouseGuiPanel;
