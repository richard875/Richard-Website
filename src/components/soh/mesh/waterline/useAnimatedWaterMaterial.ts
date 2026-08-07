import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WATER_VERTEX_SHADER, WATER_FRAGMENT_SHADER } from "../../shader";
import type { DockLightingConfig } from "../types";
import { DOCK_GLOW_POINTS_WATER_LOCAL, DOCK_LED_COLOR } from "./dockWaterline";

const useAnimatedWaterMaterial = (
  sourceMaterial: THREE.Material | undefined,
  sunDirection: THREE.Vector3,
  isNight: boolean,
  dockLighting: DockLightingConfig,
) => {
  const waterMaterial = React.useMemo(() => {
    const baseColor =
      (
        sourceMaterial as THREE.MeshStandardMaterial | undefined
      )?.color?.clone() ?? new THREE.Color("#6dc8e0");

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: baseColor },
        uHighlight: { value: new THREE.Color("#b8e5f7") },
        uSunDirection: { value: sunDirection.clone() },
        uNightMix: { value: 0 },
        // uDockGlowPoints is defined in Water_2_water_foam_0's own raw
        // vertex space (see DOCK_GLOW_POINTS_WATER_LOCAL) - this material is
        // also reused on the smaller per-building water_foam patches, whose
        // local transforms differ, so the glow can land slightly off on
        // those. They're small, distant decorative patches far from the
        // seawall, so the mismatch is not worth a per-mesh material just to
        // correct.
        uDockGlowPoints: { value: DOCK_GLOW_POINTS_WATER_LOCAL },
        uDockGlowColor: { value: new THREE.Color(DOCK_LED_COLOR) },
        uDockGlowRadius: { value: dockLighting.glowRadius },
        uDockGlowIntensity: { value: dockLighting.glowIntensity },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: WATER_VERTEX_SHADER,
      fragmentShader: WATER_FRAGMENT_SHADER,
    });
  }, [sourceMaterial]);

  useFrame(({ clock }) => {
    waterMaterial.uniforms.uTime.value = clock.getElapsedTime();
    // Track the scene's actual directional light so the water's sun/moon
    // glint lines up with the shadows/highlights on the rest of the model.
    waterMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    waterMaterial.uniforms.uNightMix.value = isNight ? 1 : 0;
    waterMaterial.uniforms.uDockGlowRadius.value = dockLighting.glowRadius;
    waterMaterial.uniforms.uDockGlowIntensity.value =
      dockLighting.glowIntensity;
  });

  return waterMaterial;
};

export default useAnimatedWaterMaterial;
