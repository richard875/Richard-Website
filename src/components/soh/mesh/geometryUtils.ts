import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// The sail mesh is exported with duplicated per-face vertices (hard edges)
// and coarse tessellation, which reads as flat "tiles" rather than the real
// building's continuous curved shells. Welding shared vertices and averaging
// normals only fixes the lighting discontinuity at each edge - the ridge is
// still geometrically sharp. Laplacian-smoothing the interior vertices
// (pinning the outer rim so the footprint/silhouette doesn't shrink) rounds
// the ridges into an actual curve.
export const smoothSailGeometry = (
  source: THREE.BufferGeometry,
  iterations = 3,
  factor = 0.4,
) => {
  const geometry = source.clone();
  // No texture is applied to this material, so UVs can't introduce visible
  // seams - drop them (and the flat per-face normals) so welding merges
  // purely on position.
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  const merged = mergeVertices(geometry, 1e-3);

  const position = merged.attributes.position as THREE.BufferAttribute;
  const index = merged.getIndex();
  if (!index) return merged;

  const vertexCount = position.count;
  const neighbors: Set<number>[] = Array.from(
    { length: vertexCount },
    () => new Set<number>(),
  );
  const edgeCounts = new Map<string, number>();
  const edgeKey = (a: number, b: number) => (a < b ? `${a}_${b}` : `${b}_${a}`);

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    [
      [a, b],
      [b, c],
      [c, a],
    ].forEach(([m, n]) => {
      neighbors[m].add(n);
      neighbors[n].add(m);
      const key = edgeKey(m, n);
      edgeCounts.set(key, (edgeCounts.get(key) ?? 0) + 1);
    });
  }

  // Edges used by only one triangle sit on the mesh boundary (the sail's
  // base rim) - pin those vertices so smoothing only rounds the interior.
  const boundary = new Uint8Array(vertexCount);
  edgeCounts.forEach((count, key) => {
    if (count === 1) {
      const [m, n] = key.split("_").map(Number);
      boundary[m] = 1;
      boundary[n] = 1;
    }
  });

  let positions = (position.array as Float32Array).slice();
  for (let iter = 0; iter < iterations; iter++) {
    const next = positions.slice();
    for (let v = 0; v < vertexCount; v++) {
      if (boundary[v]) continue;
      const neigh = neighbors[v];
      if (neigh.size === 0) continue;
      let ax = 0;
      let ay = 0;
      let az = 0;
      neigh.forEach((n) => {
        ax += positions[n * 3];
        ay += positions[n * 3 + 1];
        az += positions[n * 3 + 2];
      });
      const inv = 1 / neigh.size;
      next[v * 3] = THREE.MathUtils.lerp(positions[v * 3], ax * inv, factor);
      next[v * 3 + 1] = THREE.MathUtils.lerp(
        positions[v * 3 + 1],
        ay * inv,
        factor,
      );
      next[v * 3 + 2] = THREE.MathUtils.lerp(
        positions[v * 3 + 2],
        az * inv,
        factor,
      );
    }
    positions = next;
  }

  position.array.set(positions);
  position.needsUpdate = true;
  merged.computeVertexNormals();
  return merged;
};

// Builds a one-off local transform matrix from position/rotation/uniform
// scale - used throughout mesh/ to bake a node's transform into its
// geometry (tree instancing) or to convert between two sibling groups'
// local coordinate frames (water-glow point conversion).
export const buildLocalMatrix = (
  position: [number, number, number],
  rotation: [number, number, number],
  scale = 1,
) => {
  const object = new THREE.Object3D();
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.scale.setScalar(scale);
  object.updateMatrix();
  return object.matrix.clone();
};
