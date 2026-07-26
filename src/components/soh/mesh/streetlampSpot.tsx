import React from "react";
import {
  OPERA_HOUSE_LOCAL_XZ,
  STREETLAMP_SPOT_COLOR,
  STREETLAMP_SPOT_DISTANCE,
  STREETLAMP_SPOT_PENUMBRA,
} from "./streetlamps";
import useSpotlightTarget from "./useSpotlightTarget";

// The actual downward-facing cone of light for a streetlamp, paired with
// the NightGlow bulb dot above it. A THREE.SpotLight aims from its position
// at its `.target`'s position - unlike the light itself, `.target` is only
// transformed by its parent hierarchy if it's genuinely parented in the
// scene graph (not just handed a position via a prop), so it's rendered
// here as a real <object3D> sibling of the light and wired up imperatively
// once both refs exist. Kept tight-angle, short-range and shadowless (the
// scene already has one big shadow-casting directional light; adding real
// shadow maps to all 14 of these would be expensive for very little payoff
// at this scale).
const StreetlampSpot = ({
  position,
  intensity,
  angle,
  targetDrop,
  targetForwardOffset,
}: {
  position: [number, number, number];
  intensity: number;
  angle: number;
  targetDrop: number;
  targetForwardOffset: number;
}) => {
  const { lightRef, targetRef } = useSpotlightTarget();

  const targetPosition = React.useMemo<[number, number, number]>(() => {
    const dx = OPERA_HOUSE_LOCAL_XZ[0] - position[0];
    const dz = OPERA_HOUSE_LOCAL_XZ[1] - position[2];
    const horizontalDist = Math.hypot(dx, dz) || 1;
    return [
      position[0] + (dx / horizontalDist) * targetForwardOffset,
      position[1] - targetDrop,
      position[2] + (dz / horizontalDist) * targetForwardOffset,
    ];
  }, [position, targetDrop, targetForwardOffset]);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={STREETLAMP_SPOT_COLOR}
        intensity={intensity}
        angle={angle}
        penumbra={STREETLAMP_SPOT_PENUMBRA}
        distance={STREETLAMP_SPOT_DISTANCE}
        decay={2}
        castShadow={false}
      />
      <object3D ref={targetRef} position={targetPosition} />
    </>
  );
};

export default StreetlampSpot;
