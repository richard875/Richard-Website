import React from "react";
import * as THREE from "three";
import {
  DOCK_LIGHT_COLOR,
  DOCK_LIGHT_DISTANCE,
  DOCK_LIGHT_PENUMBRA,
} from "./waterline/dockWaterline";

export const DockLight = ({
  position,
  target,
  intensity,
  angle,
}: {
  position: [number, number, number];
  target: [number, number, number];
  intensity: number;
  angle: number;
}) => {
  const lightRef = React.useRef<THREE.SpotLight>(null!);
  const targetRef = React.useRef<THREE.Object3D>(null);

  // Dev-only wireframe cone showing exactly where each of the dock fixtures
  // sits and what it's aimed at. IS_DEV-gated, so this is a no-op (and zero
  // runtime cost) in production.
  // useHelper(IS_DEV && lightRef, THREE.SpotLightHelper);

  React.useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={DOCK_LIGHT_COLOR}
        intensity={intensity}
        angle={angle}
        penumbra={DOCK_LIGHT_PENUMBRA}
        distance={DOCK_LIGHT_DISTANCE}
        decay={2}
        castShadow={false}
      />
      <object3D ref={targetRef} position={target} />
    </>
  );
};
