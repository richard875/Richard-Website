import React from "react";
import * as THREE from "three";
import AnimatedBoat from "../../animatedBoat";

export const Boats = ({
  nodes,
  heroMaterial,
  glassMaterial,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  glassMaterial: THREE.Material;
}) => {
  const boat1Position = React.useMemo(
    () =>
      [
        Math.floor(Math.random() * (-1200 - -4200 + 1)) + -4200,
        -50,
        Math.floor(Math.random() * (3000 - 1600 + 1)) + 1600,
      ] as [number, number, number],
    [],
  );

  const boat2Position = React.useMemo(
    () =>
      [
        Math.floor(Math.random() * (1200 - -4200 + 1)) + -4200,
        -40,
        Math.floor(Math.random() * (-4700 - -6300 + 1)) + -6300,
      ] as [number, number, number],
    [],
  );

  const boat3Position = React.useMemo(
    () =>
      [
        Math.floor(Math.random() * (2000 - -800 + 1)) + -800,
        -50,
        Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000,
      ] as [number, number, number],
    [],
  );

  const boat1Rotation = React.useMemo(
    () => [0.1, Math.random() * Math.PI * 2, -0.07] as [number, number, number],
    [],
  );

  const boat2Rotation = React.useMemo(
    () =>
      [0.26, Math.random() * Math.PI * 2, -0.15] as [number, number, number],
    [],
  );

  const boat3Rotation = React.useMemo(
    () =>
      [3.02, Math.random() * Math.PI * 2, -3.01] as [number, number, number],
    [],
  );

  return (
    <group
      position={[-1746.98, 461.43, -538.72]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <AnimatedBoat
        position={boat1Position}
        rotation={boat1Rotation}
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
        position={boat2Position}
        rotation={boat2Rotation}
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
        position={boat3Position}
        rotation={boat3Rotation}
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
