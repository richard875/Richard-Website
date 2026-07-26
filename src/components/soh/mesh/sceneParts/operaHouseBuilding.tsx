import React from "react";
import * as THREE from "three";

// The podium/promenade stonework plus the opera house building itself
// (stone base, sail roof, glass, trim). Rendered as a sibling of
// Streetlamps inside mesh.tsx's shared [904.35, 676.99, 907.95] wrapper
// group, since both live in that same local coordinate frame.
const OperaHouseBuilding = ({
  nodes,
  heroMaterial,
  glassMaterial,
  sailGeometry,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  glassMaterial: THREE.Material;
  sailGeometry: THREE.BufferGeometry;
}) => (
  <>
    <group position={[-1247.34, -400.24, -1058.09]} rotation={[0, -0.09, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Floor_Stone_0 as THREE.Mesh).geometry}
        material={heroMaterial("Stone_0")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Floor_Stone_0_1 as THREE.Mesh).geometry}
        material={heroMaterial("Stone_1")}
      />
    </group>
    <group position={[-574.21, 4.03, -2224.25]} rotation={[-2.7, -1.33, 0.96]}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Sidney_Stone_0 as THREE.Mesh).geometry}
        material={heroMaterial("Stone")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Sidney_Stone1_0 as THREE.Mesh).geometry}
        material={heroMaterial("Stone.1")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={sailGeometry}
        material={heroMaterial("White_Border")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Sidney_Glass_0 as THREE.Mesh).geometry}
        material={glassMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Sidney__0 as THREE.Mesh).geometry}
        material={heroMaterial("Sidney__0")}
      />
    </group>
  </>
);

export default OperaHouseBuilding;
