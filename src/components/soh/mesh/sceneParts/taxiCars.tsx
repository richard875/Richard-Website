import React from "react";
import * as THREE from "three";

// The 4 wheels sit at the same 4 offsets (relative to each car's own inner
// group) on both taxis - only the node names differ per car (see
// TAXI_CARS below), not the placement itself.
const WHEEL_OFFSETS: {
  position: [number, number, number];
  rotation: [number, number, number];
}[] = [
  { position: [141.64, -5.82, 527.04], rotation: [-Math.PI / 2, 0, Math.PI] },
  { position: [244.09, -5.61, 528.68], rotation: [-Math.PI / 2, 0, Math.PI] },
  { position: [244.09, -5.82, 454.97], rotation: [-Math.PI / 2, 0, 0] },
  { position: [141.64, -5.61, 453.33], rotation: [-Math.PI / 2, 0, 0] },
];

// The 2 taxis parked at the drop-off - same body/wheel layout, mirrored
// (rotation) and offset a little along x, each with its own node-naming
// suffix and (for some reason unique to the source asset) its own material
// key for the car body.
type TaxiCarConfig = {
  key: string;
  groupPosition: [number, number, number];
  groupRotation: [number, number, number];
  carNode: string;
  glassNode: string;
  pipeNode: string;
  shipNode: string;
  carMaterialKey: string;
  wheelNodes: [string, string, string, string];
};

const TAXI_CARS: TaxiCarConfig[] = [
  {
    key: "taxi-1",
    groupPosition: [912.45, 66.51, -141.47],
    groupRotation: [0, 1.4, 0],
    carNode: "Car_Sedan_Taxi_1_car_0",
    glassNode: "Car_Sedan_Taxi_1_Glass_0",
    pipeNode: "Car_Sedan_Taxi_1_Pipe_1_0",
    shipNode: "Car_Sedan_Taxi_1_Ship_0",
    carMaterialKey: "material",
    wheelNodes: [
      "Wheels_1_wheels_0",
      "wheels_1_wheels_0",
      "Wheels_wheels_0",
      "wheels_wheels_0",
    ],
  },
  {
    key: "taxi-2",
    groupPosition: [632.39, 66.51, -141.47],
    groupRotation: [Math.PI, 1.48, -Math.PI],
    carNode: "Car_Sedan_Taxi_1_2_car_0",
    glassNode: "Car_Sedan_Taxi_1_2_Glass_0",
    pipeNode: "Car_Sedan_Taxi_1_2_Pipe_1_0",
    shipNode: "Car_Sedan_Taxi_1_2_Ship_0",
    carMaterialKey: "car_0",
    wheelNodes: [
      "Wheels_1_2_wheels_0",
      "wheels_1_2_wheels_0",
      "Wheels_2_wheels_0",
      "wheels_2_wheels_0",
    ],
  },
];

const TaxiCars = ({
  nodes,
  heroMaterial,
  glassMaterial,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  glassMaterial: THREE.Material;
}) => (
  <group position={[588.78, 396.08, 2376.67]}>
    {TAXI_CARS.map((car) => (
      <group
        key={car.key}
        position={car.groupPosition}
        rotation={car.groupRotation}
      >
        <group
          position={[202.06, 22.85, 492.26]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <mesh
            geometry={(nodes[car.carNode] as THREE.Mesh).geometry}
            material={heroMaterial(car.carMaterialKey)}
          />
          <mesh
            geometry={(nodes[car.glassNode] as THREE.Mesh).geometry}
            material={glassMaterial}
          />
          <mesh
            geometry={(nodes[car.pipeNode] as THREE.Mesh).geometry}
            material={heroMaterial("Pipe_1")}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes[car.shipNode] as THREE.Mesh).geometry}
            material={heroMaterial("Ship")}
          />
        </group>
        {WHEEL_OFFSETS.map((wheel, i) => (
          <mesh
            key={car.wheelNodes[i]}
            geometry={(nodes[car.wheelNodes[i]] as THREE.Mesh).geometry}
            material={heroMaterial("wheels")}
            position={wheel.position}
            rotation={wheel.rotation}
          />
        ))}
      </group>
    ))}
  </group>
);

export default TaxiCars;
