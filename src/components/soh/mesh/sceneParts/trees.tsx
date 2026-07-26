import React from "react";
import * as THREE from "three";

const Trees = ({
  nodes,
  heroMaterial,
  mergedTreeGeometry,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  mergedTreeGeometry: {
    trees: THREE.BufferGeometry;
    wood: THREE.BufferGeometry;
  };
}) => (
  <group position={[321.74, 352.86, 2903.36]}>
    {/* All 20 individual Tree_3_* instances (see treeInstances.ts) render
        here as 2 merged draw calls instead of 40 separate
        <group><mesh/><mesh/></group> nodes. */}
    <mesh
      castShadow
      receiveShadow
      geometry={mergedTreeGeometry.trees}
      material={heroMaterial("Trees")}
    />
    <mesh geometry={mergedTreeGeometry.wood} material={heroMaterial("Wood")} />
    <group
      position={[36.92, 72.09, 178.04]}
      rotation={[0, Math.PI / 2, 0]}
      scale={2}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Grass_Stone_0 as THREE.Mesh).geometry}
        material={heroMaterial("Stone")}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Grass_Trees_0 as THREE.Mesh).geometry}
        material={heroMaterial("Trees")}
      />
    </group>
  </group>
);

export default Trees;
