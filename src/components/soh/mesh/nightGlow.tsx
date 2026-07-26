import React from "react";
import * as THREE from "three";

// A dot standing in for a distant bulb - purely visual (no real light), so
// Bloom can pick it out without it ever illuminating anything nearby. An
// earlier version paired this with a real pointLight, but any point light
// sitting close to a glossy surface (the boat/opera-house glass) catches a
// tight specular hotspot that sweeps in and out of Bloom's threshold every
// frame as the model bobs via Float - a persistent flicker that no amount of
// intensity tuning fully removed. Dropping the light removes the flicker
// source entirely; the dot's own steady, tone-mapped brightness is enough to
// read as "there's a light there" once bloomed.
export const NightGlow = ({
  position,
  color,
  radius,
  brightness = 1.8,
}: {
  position: [number, number, number];
  color: string;
  radius: number;
  brightness?: number;
}) => {
  // Pushed past 1.0 by default - these are meant to be the dominant "there's
  // a light here" cue, and Bloom is what sells them as lit windows/lamps, so
  // they need to clear its threshold with room to spare. Individual call
  // sites can dial this down where full brightness reads as too intense.
  const dotColor = React.useMemo(
    () => new THREE.Color(color).multiplyScalar(brightness),
    [color, brightness],
  );

  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial color={dotColor} />
    </mesh>
  );
};

// Batched form of NightGlow for fixture arrays (dock LEDs, parking-lot
// markers, streetlamp bulbs, building windows), which each place dozens to
// over a hundred identically-sized, identically-coloured dots. Rendering
// each as its own <mesh> was a separate draw call per dot - 130 for the dock
// markers alone, ~165 across every array combined. Since every dot in a
// given array shares geometry, material and color, they're exactly what
// THREE.InstancedMesh exists for: one draw call per array instead of one
// per dot, with per-instance placement done via a matrix buffer instead of
// separate scene-graph nodes.
export const NightGlowInstances = ({
  positions,
  color,
  radius,
  brightness = 1.8,
}: {
  positions: [number, number, number][];
  color: string;
  radius: number;
  brightness?: number;
}) => {
  const meshRef = React.useRef<THREE.InstancedMesh>(null!);
  const dotColor = React.useMemo(
    () => new THREE.Color(color).multiplyScalar(brightness),
    [color, brightness],
  );

  React.useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    positions.forEach((position, i) => {
      dummy.position.set(...position);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, positions.length]}
    >
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial color={dotColor} />
    </instancedMesh>
  );
};
