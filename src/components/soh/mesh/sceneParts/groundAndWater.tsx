import React from "react";
import * as THREE from "three";
import {
  WATER_MESH_LOCAL_POSITION,
  WATER_MESH_LOCAL_ROTATION,
} from "../waterline/dockWaterline";

export const GroundAndWater = ({
  nodes,
  heroMaterial,
  animatedWaterMaterial,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  animatedWaterMaterial: THREE.Material;
}) => (
  <group position={[69.93, -55.57, -44.55]} rotation={[0, -Math.PI / 2, 0]}>
    <group position={[-94.09, -528.54, 49.23]} rotation={[0, Math.PI / 2, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Floor_3_Ground_0 as THREE.Mesh).geometry}
        material={heroMaterial("Ground")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Floor_3_Ground_0_1 as THREE.Mesh).geometry}
        material={heroMaterial("Ground_0")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Floor_3_Ground_0_2 as THREE.Mesh).geometry}
        material={heroMaterial("Ground_1")}
      />
    </group>
    <group position={[-90.84, -228.19, 39.01]}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Stones_2__0 as THREE.Mesh).geometry}
        material={heroMaterial("Sidney__0")}
        position={[-439.62, 34.01, -1.85]}
        rotation={[Math.PI, Math.PI / 2, 0]}
      />
    </group>
    <mesh
      castShadow
      receiveShadow
      geometry={(nodes.Water_2_water_foam_0 as THREE.Mesh).geometry}
      material={animatedWaterMaterial}
      position={WATER_MESH_LOCAL_POSITION}
      rotation={WATER_MESH_LOCAL_ROTATION}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={(nodes.Stones_Stone_0 as THREE.Mesh).geometry}
      material={heroMaterial("Stone_2")}
      position={[-770.29, -420.19, 39.78]}
      rotation={[Math.PI, Math.PI / 2, 0]}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={(nodes.Pipes1_1_Pipe_1_0 as THREE.Mesh).geometry}
      material={heroMaterial("Pipe_1")}
      position={[-1493.47, -524.33, -558.15]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={(nodes.Pipes1_Pipe_1_0 as THREE.Mesh).geometry}
      material={heroMaterial("Pipe_1")}
      position={[711.34, -477.22, 1370.1]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
    />
  </group>
);
