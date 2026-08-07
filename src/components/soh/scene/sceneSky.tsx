import React from "react";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { GLOBAL_VERTEX_SHADER, GLOBAL_FRAGMENT_SHADER } from "../shader";
import type { TimeLightingKeyframe } from "./lightingKeyframes";

export type SkyUniforms = {
  topColor: { value: THREE.Color };
  bottomColor: { value: THREE.Color };
  offset: { value: number };
  exponent: { value: number };
};

// The sky sphere (a shaderMaterial gradient, kept in sync with the day/
// night palette by useSceneFogSync mutating `uniforms` in place) plus the
// star/dust Sparkles field in front of it.
const SceneSky = ({
  uniforms,
  skySphereGeometryX,
  skySphereGeometryY,
  skySphereGeometryZ,
  effectiveIsNight,
  sparklesOpacity,
  dayLighting,
}: {
  uniforms: SkyUniforms;
  skySphereGeometryX: number;
  skySphereGeometryY: number;
  skySphereGeometryZ: number;
  effectiveIsNight: boolean;
  sparklesOpacity: number;
  dayLighting: TimeLightingKeyframe;
}) => (
  <>
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
      count={effectiveIsNight ? 30 : 60}
      scale={[4, 2.2, 4]}
      size={effectiveIsNight ? 1.2 : 1.8}
      speed={0.25}
      opacity={
        effectiveIsNight
          ? Math.min(sparklesOpacity, 0.15)
          : sparklesOpacity * dayLighting.sparkleOpacityScale
      }
      color={effectiveIsNight ? "#dce8ff" : dayLighting.sparkleColor}
      position={[0, 0.6, 0]}
    />
  </>
);

export default SceneSky;
