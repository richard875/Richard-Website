import React from "react";
import * as THREE from "three";
import {
  DAY_FOG_FAR,
  DAY_FOG_NEAR,
  NIGHT_FOG_FAR,
  NIGHT_FOG_NEAR,
  NIGHT_SKY_BOTTOM,
  NIGHT_SKY_TOP,
} from "./lightingKeyframes";
import type { TimeLightingKeyframe } from "./lightingKeyframes";

type SkyUniforms = {
  topColor: { value: THREE.Color };
  bottomColor: { value: THREE.Color };
};

// Sets up the sky/fog once on mount, then keeps the sky/fog palette and
// distances in sync as night mode, twilight, and time-of-day change. Fog
// and background share the same Color instance (assigned on mount), so
// mutating it here keeps the horizon and the fog blending seamlessly
// either way.
//
// `deps` is the exact list of primitive gui-slider/hour values the sync
// effect should react to - passed in by the caller rather than computed
// here, since those are the only things that ever actually change
// dayHemiColor/dayLighting (both are fresh objects every render, so
// depending on them directly would fire this effect on every render
// instead of only when something that affects the sky actually changed).
export const useSceneFogSync = (
  scene: THREE.Scene,
  uniforms: SkyUniforms,
  effectiveIsNight: boolean,
  dayHemiColor: THREE.Color,
  dayLighting: TimeLightingKeyframe,
  deps: React.DependencyList,
) => {
  React.useEffect(() => {
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, DAY_FOG_NEAR, DAY_FOG_FAR);
    scene.fog.color.copy(uniforms["bottomColor"].value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!scene.fog) return;
    uniforms.topColor.value.copy(
      effectiveIsNight ? NIGHT_SKY_TOP : dayHemiColor,
    );
    uniforms.bottomColor.value.copy(
      effectiveIsNight
        ? NIGHT_SKY_BOTTOM
        : new THREE.Color(dayLighting.skyBottom),
    );
    scene.fog.color.copy(uniforms.bottomColor.value);
    (scene.fog as THREE.Fog).near = effectiveIsNight
      ? NIGHT_FOG_NEAR
      : dayLighting.fogNear;
    (scene.fog as THREE.Fog).far = effectiveIsNight
      ? NIGHT_FOG_FAR
      : dayLighting.fogFar;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
