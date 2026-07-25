import * as THREE from "three";
import {
  AFTERNOON_KEYFRAME,
  DAWN_KEYFRAME,
  DAY_FOG_FAR,
  DAY_FOG_NEAR,
  DAY_SKY_BOTTOM,
  DIMMED_KEYFRAME,
  DUSK_KEYFRAME,
  MORNING_KEYFRAME,
  NEUTRAL_CLOUD_COLOR,
  NIGHT_AMBIENT_INTENSITY,
  NIGHT_CLOUD_COLOR,
  NIGHT_CLOUD_OPACITY_SCALE,
  NIGHT_DIR_COLOR,
  NIGHT_DIR_INTENSITY,
  NIGHT_HEMI_COLOR,
  NIGHT_HEMI_GROUND_COLOR,
  NIGHT_HEMI_INTENSITY,
  NIGHT_MOON_POSITION,
  NOON_KEYFRAME,
  TimeLightingKeyframe,
  interpolateDayLighting,
} from "./lightingKeyframes";
import { useCurrentHour } from "./useCurrentHour";

export type DayNightLightingInputs = {
  ambientLightIntensity: number;
  hemiLightIntensity: number;
  hemiLightColorX: number;
  hemiLightColorY: number;
  hemiLightColorZ: number;
  hemiGroundColorX: number;
  hemiGroundColorY: number;
  hemiGroundColorZ: number;
  dirLightIntensity: number;
  dirLightColorX: number;
  dirLightColorY: number;
  dirLightColorZ: number;
  dirPositionX: number;
  dirPositionY: number;
  dirPositionZ: number;
  overrideScene: boolean;
  isNight: boolean;
  systemIsDarkMode: boolean;
  timeOfDayHour: number;
  dimmed: boolean;
  cloudOpacity: number;
};

// All of Model's day/night derived state in one place: which look is
// currently active (real day/night/twilight or the manual gui overrides),
// where "now" falls on the day keyframe curve, and every effective
// light/sky/cloud value that follows from that. See lightingKeyframes.ts
// for the actual keyframe data this interpolates between.
export const useDayNightLighting = (inputs: DayNightLightingInputs) => {
  const {
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
  } = inputs;

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
  // The one extra "outside daylight hours" scene (see DIMMED_KEYFRAME) -
  // only relevant in day mode; night mode already has its own always-on
  // look regardless of clock time. Strictly > 19 (not >= 19) so hour 19
  // exactly - the Daytime slider's own max value - still resolves to
  // DUSK_KEYFRAME via the day interpolation below rather than jumping
  // straight to the twilight look right at the boundary you're most likely
  // to actually test.
  const isTwilight =
    !effectiveIsNight &&
    (dimmedOverrideActive || effectiveHour < 7 || effectiveHour > 19);

  // The 17:00 (5pm) keyframe is built from the Ambient/Hemi/Direct Light gui
  // slider state directly - the same warm/golden values this scene has
  // always defaulted to - so those sliders stay live for tuning that one
  // anchor instead of going dead once time-of-day drives the render.
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
    DIMMED_KEYFRAME,
  ];
  // Twilight (see isTwilight above) pins the hour fed into the day curve at
  // DIMMED_KEYFRAME's 19:30 rather than following the real clock (or the
  // Daytime slider, which tops out at 19 anyway and never reaches this
  // segment on its own) - it's meant to read as one small, static step
  // dimmer than 19:00, not a continued sweep into full darkness the way
  // Night Mode is.
  const lightingHour = isTwilight ? DIMMED_KEYFRAME.hour : effectiveHour;
  const dayLighting = interpolateDayLighting(lightingHour, dayKeyframes);
  const dayHemiColor = new THREE.Color().setHSL(...dayLighting.hemiColorHSL);
  const dayHemiGroundColor = new THREE.Color().setHSL(
    ...dayLighting.hemiGroundColorHSL,
  );
  const dayDirColor = new THREE.Color().setHSL(...dayLighting.dirColorHSL);
  const dayDirPosition = new THREE.Vector3(...dayLighting.dirPosition);

  // Night mode swaps in fixed lighting/atmosphere values instead of the day
  // gui sliders above, so toggling it never disturbs the day-tuned values.
  // Twilight no longer needs its own branch here - it already reaches this
  // dayLighting/dayHemiColor/etc set (built off DIMMED_KEYFRAME) via
  // lightingHour above, so it just falls through the same day branch as
  // every other hour.
  const effectiveAmbientIntensity = effectiveIsNight
    ? NIGHT_AMBIENT_INTENSITY
    : dayLighting.ambientIntensity;
  const effectiveHemiIntensity = effectiveIsNight
    ? NIGHT_HEMI_INTENSITY
    : dayLighting.hemiIntensity;
  const effectiveHemiColor = effectiveIsNight ? NIGHT_HEMI_COLOR : dayHemiColor;
  const effectiveHemiGroundColor = effectiveIsNight
    ? NIGHT_HEMI_GROUND_COLOR
    : dayHemiGroundColor;
  const effectiveDirIntensity = effectiveIsNight
    ? NIGHT_DIR_INTENSITY
    : dayLighting.dirIntensity;
  const effectiveDirColor = effectiveIsNight ? NIGHT_DIR_COLOR : dayDirColor;
  // Fixed moon position instead of the day light's keyframed arc, so the
  // visible moon disc and the water's moon-glint always agree at night.
  const effectiveDirPosition = effectiveIsNight
    ? NIGHT_MOON_POSITION
    : dayDirPosition;

  // The Cloud puffs are unlit, so night-dimming them means swapping their
  // color/opacity directly rather than relying on scene light intensity.
  // Twilight no longer needs its own branch here either - DIMMED_KEYFRAME's
  // cloudWarmth (1, same as DUSK_KEYFRAME/goldenHourKeyframe) already flows
  // through dayLighting.cloudWarmth via lightingHour above.
  const cloudColor = (dayColor: string) => {
    if (effectiveIsNight) return NIGHT_CLOUD_COLOR;
    return NEUTRAL_CLOUD_COLOR.clone().lerp(
      new THREE.Color(dayColor),
      THREE.MathUtils.clamp(dayLighting.cloudWarmth, 0, 1),
    );
  };
  const resolveCloudOpacity = (mult: number) =>
    cloudOpacity * mult * (effectiveIsNight ? NIGHT_CLOUD_OPACITY_SCALE : 1);

  return {
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
  };
};
