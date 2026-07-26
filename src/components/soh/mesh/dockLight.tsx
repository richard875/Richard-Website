import React from "react";
import {
  DOCK_LIGHT_COLOR,
  DOCK_LIGHT_DISTANCE,
  DOCK_LIGHT_PENUMBRA,
} from "./waterline/dockWaterline";
import useSpotlightTarget from "./useSpotlightTarget";

const DockLight = ({
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
  const { lightRef, targetRef } = useSpotlightTarget();

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

export default DockLight;
