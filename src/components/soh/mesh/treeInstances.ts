import React from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { buildLocalMatrix } from "./geometryUtils";

// The 20 Tree_3_* nodes are the same tree model repeated around the plaza,
// each as its own <group position/rotation scale={2}><mesh/><mesh/></group>
// pair (one mesh for the Trees material, one for the trunk's Wood
// material) - 40 draw calls for what's visually one repeated asset. None of
// this is animated, so instead of rendering each instance as its own scene
// node, every instance's geometry is transformed by its own position/
// rotation/scale (via buildLocalMatrix) and merged into a single static
// BufferGeometry per material - see useMergedTreeGeometry below. This is
// exactly what static batching exists for: identical, non-animated meshes
// that only differ by transform cost nothing extra to draw once merged, so
// the GPU submits 2 draw calls instead of 40.
export const TREE_INSTANCES: {
  treesNode: string;
  woodNode: string;
  position: [number, number, number];
  rotation: [number, number, number];
}[] = [
  {
    treesNode: "Tree_3_15_Trees_0",
    woodNode: "Tree_3_15_Wood_0",
    position: [-301.47, -5.81, 128.39],
    rotation: [3.02, 0.7, -Math.PI / 2],
  },
  {
    treesNode: "Tree_3_14_Trees_0",
    woodNode: "Tree_3_14_Wood_0",
    position: [1338.04, 42.07, -50.35],
    rotation: [3.02, 0.7, -Math.PI / 2],
  },
  {
    treesNode: "Tree_3_13_Trees_0",
    woodNode: "Tree_3_13_Wood_0",
    position: [1092.19, -5.81, -81.8],
    rotation: [3.02, 0.7, -Math.PI / 2],
  },
  {
    treesNode: "Tree_3_12_Trees_0",
    woodNode: "Tree_3_12_Wood_0",
    position: [-1735.52, -5.81, -86.69],
    rotation: [0.13, 0.8, 1.39],
  },
  {
    treesNode: "Tree_3_11_Trees_0",
    woodNode: "Tree_3_11_Wood_0",
    position: [-1178.98, -5.81, -86.69],
    rotation: [0.13, 0.8, 1.39],
  },
  {
    treesNode: "Tree_3_10_Trees_0",
    woodNode: "Tree_3_10_Wood_0",
    position: [-2035.27, -5.81, -86.69],
    rotation: [0.13, 0.8, 1.39],
  },
  {
    treesNode: "Tree_3_9_Trees_0",
    woodNode: "Tree_3_9_Wood_0",
    position: [1504, -5.81, 20.7],
    rotation: [0.13, 0.8, 1.39],
  },
  {
    treesNode: "Tree_3_8_Trees_0",
    woodNode: "Tree_3_8_Wood_0",
    position: [25.82, -5.81, 60.52],
    rotation: [0.11, -0.5, 1.54],
  },
  {
    treesNode: "Tree_3_7_Trees_0",
    woodNode: "Tree_3_7_Wood_0",
    position: [247.29, -5.81, -45],
    rotation: [0.11, -0.5, 1.54],
  },
  {
    treesNode: "Tree_3_6_Trees_0",
    woodNode: "Tree_3_6_Wood_0",
    position: [725.37, -5.81, 20.7],
    rotation: [0.13, 0.8, 1.39],
  },
  {
    treesNode: "Tree_3_4_Trees_0",
    woodNode: "Tree_3_4_Wood_0",
    position: [-609.23, -31.36, 87.11],
    rotation: [1.22, Math.PI / 2, 0],
  },
  {
    treesNode: "Tree_3_1_Trees_0",
    woodNode: "Tree_3_1_Wood_0",
    position: [-329.65, -5.81, -135.03],
    rotation: [3.02, 0.7, -Math.PI / 2],
  },
  {
    treesNode: "Tree_3_Trees_0",
    woodNode: "Tree_3_Wood_0",
    position: [-880.63, -5.81, 48.82],
    rotation: [0.13, 0.8, 1.39],
  },
  {
    treesNode: "Tree_3_3_Trees_0",
    woodNode: "Tree_3_3_Wood_0",
    position: [443.6, 6.26, 24.37],
    rotation: [-1.11, 1.41, 2.43],
  },
  {
    treesNode: "Tree_3_2_Trees_0",
    woodNode: "Tree_3_2_Wood_0",
    position: [511.17, -31.36, 23.76],
    rotation: [1.22, Math.PI / 2, 0],
  },
  {
    treesNode: "Tree_3_5_Trees_0",
    woodNode: "Tree_3_5_Wood_0",
    position: [979.68, 6.26, 40.44],
    rotation: [-0.28, 0.91, 1.56],
  },
  {
    treesNode: "Tree_3_16_Trees_0",
    woodNode: "Tree_3_16_Wood_0",
    position: [-2692.46, -5.81, -86.69],
    rotation: [0.09, -0.06, 1.5],
  },
  {
    treesNode: "Tree_3_17_Trees_0",
    woodNode: "Tree_3_17_Wood_0",
    position: [-2325.74, -5.81, 98.85],
    rotation: [0.09, -0.06, 1.5],
  },
  {
    treesNode: "Tree_3_18_Trees_0",
    woodNode: "Tree_3_18_Wood_0",
    position: [-1463.47, -5.81, 80.2],
    rotation: [0.09, -0.06, 1.5],
  },
  {
    treesNode: "Tree_3_19_Trees_0",
    woodNode: "Tree_3_19_Wood_0",
    position: [-2389.95, 6.26, -139.06],
    rotation: [-1.11, 1.41, 2.43],
  },
];

// See TREE_INSTANCES above - each of the 20 trees' geometry is baked into
// world-local space with its own transform, then merged into one shared
// BufferGeometry per material. mergeGeometries requires every input to
// share the same set of vertex attributes; the source meshes already all
// come from the same "tree" gltf asset repeated 20 times, so this holds
// without needing to strip/normalize attributes first.
export const useMergedTreeGeometry = (nodes: Record<string, THREE.Object3D>) =>
  React.useMemo(() => {
    const treesGeometries = TREE_INSTANCES.map((instance) =>
      (nodes[instance.treesNode] as THREE.Mesh).geometry
        .clone()
        .applyMatrix4(
          buildLocalMatrix(instance.position, instance.rotation, 2),
        ),
    );
    const woodGeometries = TREE_INSTANCES.map((instance) =>
      (nodes[instance.woodNode] as THREE.Mesh).geometry
        .clone()
        .applyMatrix4(
          buildLocalMatrix(instance.position, instance.rotation, 2),
        ),
    );
    return {
      // Non-null: TREE_INSTANCES is a fixed, non-empty array, so
      // mergeGeometries (which can only return null for an empty input) is
      // guaranteed a geometry here.
      trees: mergeGeometries(treesGeometries)!,
      wood: mergeGeometries(woodGeometries)!,
    };
  }, [nodes]);
