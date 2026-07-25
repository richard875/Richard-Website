import React from "react";
import * as THREE from "three";
import { NightGlow } from "../nightGlow";

// Bounding-box centers (local space, inside each building's own group) of the
// building facades, used to fake a lit window since none of these buildings
// actually have separate window/glass geometry in the model.
const BUILDING_WINDOW_LIGHT_POSITIONS: [number, number, number][] = [
  [-349, -10, -247], // Building_1
  [371, -20, 121], // Building_1_2
  [-318, -15, -16], // Building
  [200, -5, 111], // Building_2
  [200, -5, 155], // Building_2_2
];

// The 5 waterfront buildings around the promenade - each an independent
// group with its own position/rotation, sharing the same White_Border/roof/
// water_foam/Pipe_1 node-naming convention (`${key}_<part>_0`). Not every
// building has every part (Building_1 has no roof mesh; the plain
// "Building" has neither a roof nor a Pipe_1 mesh), so `hasRoof`/`hasPipe`
// gate those two per building instead of assuming all 5 are identical.
type BuildingConfig = {
  key: string;
  position: [number, number, number];
  rotation: [number, number, number];
  hasRoof: boolean;
  hasPipe: boolean;
  windowIndex: number;
};

const BUILDINGS: BuildingConfig[] = [
  {
    key: "Building_1",
    position: [551.39, 89.05, -2587.33],
    rotation: [0, -1.56, 0],
    hasRoof: false,
    hasPipe: true,
    windowIndex: 0,
  },
  {
    key: "Building_1_2",
    position: [892.26, -49.52, 3663.72],
    rotation: [0, -0.46, 0],
    hasRoof: true,
    hasPipe: false,
    windowIndex: 1,
  },
  {
    key: "Building",
    position: [-4920.47, 45.21, -45.44],
    rotation: [0, -0.26, 0],
    hasRoof: false,
    hasPipe: false,
    windowIndex: 2,
  },
  {
    key: "Building_2",
    position: [-775.48, 120.3, -1076.12],
    rotation: [3.14, 1.57, -3.14],
    hasRoof: true,
    hasPipe: false,
    windowIndex: 3,
  },
  {
    key: "Building_2_2",
    position: [-332.83, 120.3, -1076.12],
    rotation: [3.14, 1.57, -3.14],
    hasRoof: true,
    hasPipe: false,
    windowIndex: 4,
  },
];

const Buildings = ({
  nodes,
  heroMaterial,
  animatedWaterMaterial,
  isNight,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  animatedWaterMaterial: THREE.Material;
  isNight: boolean;
}) => (
  <group position={[931.95, 509.87, 1401.82]} rotation={[0, -Math.PI / 2, 0]}>
    {BUILDINGS.map((building) => (
      <group
        key={building.key}
        position={building.position}
        rotation={building.rotation}
      >
        {building.hasPipe && (
          <mesh
            castShadow
            receiveShadow
            geometry={
              (nodes[`${building.key}_Pipe_1_0`] as THREE.Mesh).geometry
            }
            material={heroMaterial("Pipe_1")}
          />
        )}
        {building.hasRoof && (
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes[`${building.key}_roof_0`] as THREE.Mesh).geometry}
            material={heroMaterial("roof")}
          />
        )}
        <mesh
          castShadow
          receiveShadow
          geometry={
            (nodes[`${building.key}_White_Border_0`] as THREE.Mesh).geometry
          }
          material={heroMaterial("White_Border")}
        />
        <mesh
          geometry={
            (nodes[`${building.key}_water_foam_0`] as THREE.Mesh).geometry
          }
          material={animatedWaterMaterial}
        />
        {isNight && (
          <NightGlow
            position={BUILDING_WINDOW_LIGHT_POSITIONS[building.windowIndex]}
            color="#ff9d4d"
            radius={80}
            brightness={2.2}
          />
        )}
      </group>
    ))}
  </group>
);

export default Buildings;
