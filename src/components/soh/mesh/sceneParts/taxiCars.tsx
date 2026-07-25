import React from "react";
import * as THREE from "three";

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
    <group position={[912.45, 66.51, -141.47]} rotation={[0, 1.4, 0]}>
      <group position={[202.06, 22.85, 492.26]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh
          geometry={(nodes.Car_Sedan_Taxi_1_car_0 as THREE.Mesh).geometry}
          material={heroMaterial("material")}
        />
        <mesh
          geometry={(nodes.Car_Sedan_Taxi_1_Glass_0 as THREE.Mesh).geometry}
          material={glassMaterial}
        />
        <mesh
          geometry={(nodes.Car_Sedan_Taxi_1_Pipe_1_0 as THREE.Mesh).geometry}
          material={heroMaterial("Pipe_1")}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Car_Sedan_Taxi_1_Ship_0 as THREE.Mesh).geometry}
          material={heroMaterial("Ship")}
        />
      </group>
      <mesh
        geometry={(nodes.Wheels_1_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[141.64, -5.82, 527.04]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <mesh
        geometry={(nodes.wheels_1_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[244.09, -5.61, 528.68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <mesh
        geometry={(nodes.Wheels_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[244.09, -5.82, 454.97]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={(nodes.wheels_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[141.64, -5.61, 453.33]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
    <group
      position={[632.39, 66.51, -141.47]}
      rotation={[Math.PI, 1.48, -Math.PI]}
    >
      <group position={[202.06, 22.85, 492.26]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh
          geometry={(nodes.Car_Sedan_Taxi_1_2_car_0 as THREE.Mesh).geometry}
          material={heroMaterial("car_0")}
        />
        <mesh
          geometry={(nodes.Car_Sedan_Taxi_1_2_Glass_0 as THREE.Mesh).geometry}
          material={glassMaterial}
        />
        <mesh
          geometry={(nodes.Car_Sedan_Taxi_1_2_Pipe_1_0 as THREE.Mesh).geometry}
          material={heroMaterial("Pipe_1")}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Car_Sedan_Taxi_1_2_Ship_0 as THREE.Mesh).geometry}
          material={heroMaterial("Ship")}
        />
      </group>
      <mesh
        geometry={(nodes.Wheels_1_2_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[141.64, -5.82, 527.04]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <mesh
        geometry={(nodes.wheels_1_2_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[244.09, -5.61, 528.68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <mesh
        geometry={(nodes.Wheels_2_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[244.09, -5.82, 454.97]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={(nodes.wheels_2_wheels_0 as THREE.Mesh).geometry}
        material={heroMaterial("wheels")}
        position={[141.64, -5.61, 453.33]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  </group>
);

export default TaxiCars;
