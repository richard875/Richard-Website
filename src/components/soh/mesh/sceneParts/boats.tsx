import React from "react";
import * as THREE from "three";
import AnimatedBoat from "../../animatedBoat";

// Inclusive of both ends, matching the original per-boat
// `Math.floor(Math.random() * (max - min + 1)) + min` expressions this
// replaces.
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// One entry per yacht - a random spot within its own patch of water (kept
// separate per boat so they don't cluster or overlap) and a random heading,
// picked once on mount via useState's lazy initializer rather than
// useMemo(() => ..., []) - useMemo is only a cache React is allowed to drop
// and recompute (e.g. under StrictMode's double-invoke), which would jump
// these boats to a new random spot; useState's initializer is guaranteed to
// run exactly once.
const BOAT_SPAWN_RANGES: {
  x: [number, number];
  y: number;
  z: [number, number];
  pitch: number;
  roll: number;
}[] = [
  { x: [-4200, -1200], y: -50, z: [1600, 3000], pitch: 0.1, roll: -0.07 },
  { x: [-4200, 1200], y: -40, z: [-6300, -4700], pitch: 0.26, roll: -0.15 },
  { x: [-800, 2000], y: -50, z: [2000, 3000], pitch: 3.02, roll: -3.01 },
];

const useBoatSpawn = (range: (typeof BOAT_SPAWN_RANGES)[number]) => {
  const [position] = React.useState<[number, number, number]>(() => [
    randomInt(...range.x),
    range.y,
    randomInt(...range.z),
  ]);
  const [rotation] = React.useState<[number, number, number]>(() => [
    range.pitch,
    Math.random() * Math.PI * 2,
    range.roll,
  ]);
  return { position, rotation };
};

const Boats = ({
  nodes,
  heroMaterial,
  glassMaterial,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  glassMaterial: THREE.Material;
}) => {
  const boat1 = useBoatSpawn(BOAT_SPAWN_RANGES[0]);
  const boat2 = useBoatSpawn(BOAT_SPAWN_RANGES[1]);
  const boat3 = useBoatSpawn(BOAT_SPAWN_RANGES[2]);

  return (
    <group
      position={[-1746.98, 461.43, -538.72]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <AnimatedBoat
        position={boat1.position}
        rotation={boat1.rotation}
        speed={1.1}
        amplitude={180}
        drift={120}
        phase={0.4}
        boatLength={80}
        boatWidth={20}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Yacht_White_Border_0 as THREE.Mesh).geometry}
          material={heroMaterial("White_Border")}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Yacht_Ship_0 as THREE.Mesh).geometry}
          material={heroMaterial("Ship")}
        />
        <mesh
          geometry={(nodes.Yacht_Glass_0 as THREE.Mesh).geometry}
          material={glassMaterial}
        />
      </AnimatedBoat>
      <AnimatedBoat
        position={boat2.position}
        rotation={boat2.rotation}
        speed={1.3}
        amplitude={160}
        drift={110}
        phase={1.8}
        boatLength={70}
        boatWidth={18}
        orientationOffset={[0, Math.PI / 2, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Yacht_4_White_Border_0 as THREE.Mesh).geometry}
          material={heroMaterial("White_Border")}
        />
        <mesh
          geometry={(nodes.Yacht_4_Glass_0 as THREE.Mesh).geometry}
          material={glassMaterial}
        />
      </AnimatedBoat>
      <AnimatedBoat
        position={boat3.position}
        rotation={boat3.rotation}
        speed={0.95}
        amplitude={200}
        drift={130}
        phase={2.4}
        boatLength={75}
        boatWidth={22}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Yacht_1_White_Border_0 as THREE.Mesh).geometry}
          material={heroMaterial("White_Border")}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Yacht_1_Ship_0 as THREE.Mesh).geometry}
          material={heroMaterial("Ship")}
        />
        <mesh
          geometry={(nodes.Yacht_1_Glass_0 as THREE.Mesh).geometry}
          material={glassMaterial}
        />
      </AnimatedBoat>
    </group>
  );
};

export default Boats;
