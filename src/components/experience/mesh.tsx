import React from "react";
import * as THREE from "three";
import { useGLTF, useHelper } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  mergeVertices,
  mergeGeometries,
} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { WATER_VERTEX_SHADER, WATER_FRAGMENT_SHADER } from "./shader";
import AnimatedBoat from "./AnimatedBoat";
import { IS_DEV } from "../../constants/environment";

const MODEL_PATH = "/models/sydneyOperaHouse/sydneyOperaHouse.gltf";

// Fallback used only if no scene sun direction is supplied.
const DEFAULT_SUN_DIRECTION = new THREE.Vector3(0.6, 0.2, 0.4);

// The sail mesh is exported with duplicated per-face vertices (hard edges)
// and coarse tessellation, which reads as flat "tiles" rather than the real
// building's continuous curved shells. Welding shared vertices and averaging
// normals only fixes the lighting discontinuity at each edge - the ridge is
// still geometrically sharp. Laplacian-smoothing the interior vertices
// (pinning the outer rim so the footprint/silhouette doesn't shrink) rounds
// the ridges into an actual curve.
const smoothSailGeometry = (
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

// The "Streetlight_s" mesh bakes every lamp post along the promenade into
// one geometry rather than separate nodes. These (x, z) pairs are every real
// lamp head cluster found by grouping that mesh's vertices by position - 14
// distinct posts. (The clustering that found these used a crude 300-unit
// rounding grid, which split a few single lamp posts across two adjacent
// buckets - those duplicate pairs showed up as two overlapping glow balls on
// the same post and have been merged back into one entry each here.)
const STREETLAMP_LOCAL_POSITIONS: [number, number, number][] = [
  [534, 90, 903],
  [-1773, 90, -2410],
  [-278, 90, -1724],
  [1808, 90, -1107],
  [1235, 90, 1013],
  [635, 90, -1578],
  [1710, 90, 241],
  [-1180, 90, -2042],
  [-1743, 90, 525],
  [-2206, 90, 490],
  [1996, 90, -705],
  [-621, 90, 707],
  [1909, 90, -199],
  [1312, 90, -1483],
];

// SpotLight color/cone for the streetlamps - tuned to pool tightly on the
// pavement directly under each post rather than spill across the plaza.
// Color/penumbra/distance are left fixed (not exposed in the GUI); the rest
// of these are just the starting values for the shared, GUI-adjustable
// StreetlampLightingConfig below - every one of the 14 posts renders from
// the same object, unlike SailFloodlightConfig's array of independent
// per-fixture configs, since these fixtures really are identical.
const STREETLAMP_SPOT_COLOR = "#ffb066";
const STREETLAMP_SPOT_PENUMBRA = 0.65;
// `distance`/`intensity` are literal world-space numbers - three.js does
// NOT rescale them by the parent group's transform the way it does a
// light's position, so these look nothing like the STREETLAMP_LOCAL_POSITIONS
// coordinates even though the light sits in that same local hierarchy.
const STREETLAMP_SPOT_DISTANCE = 0.45;
export type StreetlampLightingConfig = {
  intensity: number;
  angle: number;
  // How far straight down (in the SAME local, pre-scale units as
  // STREETLAMP_LOCAL_POSITIONS) from each lamp head the aim target sits.
  // This is local-space, so it DOES get carried through the parent's
  // transform along with the light's own position - that's what actually
  // points the cone down at the ground instead of off in some arbitrary
  // direction.
  targetDrop: number;
  // Horizontal nudge (same local units) applied to the target alongside the
  // vertical drop, so the cone rakes forward off the post instead of
  // landing in a perfect circle directly underneath it - like a real lamp
  // head cantilevered out over the path on an arm.
  targetForwardOffset: number;
};
export const DEFAULT_STREETLAMP_LIGHTING: StreetlampLightingConfig = {
  intensity: 0.3,
  angle: 0.8,
  targetDrop: 85,
  targetForwardOffset: 70,
};
// The Sydney Opera House's origin (the Sidney_Stone group's position),
// expressed in this same streetlamp-group local coordinate space. The two
// groups are siblings under the same parent in the JSX below, so this was
// found by inverting the streetlamp group's own position/rotation/scale
// ([-50.42, 58.02, -1712.52], rotation [Math.PI, 1.5, -Math.PI], scale 2)
// and applying it to the opera house group's local position
// ([-574.21, 4.03, -2224.25]) - the shared parent's transform cancels out
// since both groups sit under it. Used below to bias every lamp's target
// horizontally toward the opera house instead of one arbitrary shared axis.
const OPERA_HOUSE_LOCAL_XZ: [number, number] = [273.75, -243.14];

// The actual downward-facing cone of light for a streetlamp, paired with
// the NightGlow bulb dot above. A THREE.SpotLight aims from its position at
// its `.target`'s position - unlike the light itself, `.target` is only
// transformed by its parent hierarchy if it's genuinely parented in the
// scene graph (not just handed a position via a prop), so it's rendered
// here as a real <object3D> sibling of the light and wired up imperatively
// once both refs exist. Kept tight-angle, short-range and shadowless (the
// scene already has one big shadow-casting directional light; adding real
// shadow maps to all 14 of these would be expensive for very little payoff
// at this scale).
const StreetlampSpot = ({
  position,
  intensity,
  angle,
  targetDrop,
  targetForwardOffset,
}: {
  position: [number, number, number];
  intensity: number;
  angle: number;
  targetDrop: number;
  targetForwardOffset: number;
}) => {
  const lightRef = React.useRef<THREE.SpotLight>(null);
  const targetRef = React.useRef<THREE.Object3D>(null);

  React.useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  const targetPosition = React.useMemo<[number, number, number]>(() => {
    const dx = OPERA_HOUSE_LOCAL_XZ[0] - position[0];
    const dz = OPERA_HOUSE_LOCAL_XZ[1] - position[2];
    const horizontalDist = Math.hypot(dx, dz) || 1;
    return [
      position[0] + (dx / horizontalDist) * targetForwardOffset,
      position[1] - targetDrop,
      position[2] + (dz / horizontalDist) * targetForwardOffset,
    ];
  }, [position, targetDrop, targetForwardOffset]);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={STREETLAMP_SPOT_COLOR}
        intensity={intensity}
        angle={angle}
        penumbra={STREETLAMP_SPOT_PENUMBRA}
        distance={STREETLAMP_SPOT_DISTANCE}
        decay={2}
        castShadow={false}
      />
      <object3D ref={targetRef} position={targetPosition} />
    </>
  );
};

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

type MeshProps = {
  sunDirection?: THREE.Vector3;
  isNight?: boolean;
  sailFloodlights?: SailFloodlightConfig[];
  dockLighting?: DockLightingConfig;
  streetlampLighting?: StreetlampLightingConfig;
};

// A dot standing in for a distant bulb - purely visual (no real light), so
// Bloom can pick it out without it ever illuminating anything nearby. An
// earlier version paired this with a real pointLight, but any point light
// sitting close to a glossy surface (the boat/opera-house glass) catches a
// tight specular hotspot that sweeps in and out of Bloom's threshold every
// frame as the model bobs via Float - a persistent flicker that no amount of
// intensity tuning fully removed. Dropping the light removes the flicker
// source entirely; the dot's own steady, tone-mapped brightness is enough to
// read as "there's a light there" once bloomed.
const NightGlow = ({
  position,
  color,
  radius,
  brightness = 1.8,
}: {
  position: [number, number, number];
  color: string;
  radius: number;
  brightness?: number;
}) => {
  // Pushed past 1.0 by default - these are meant to be the dominant "there's
  // a light here" cue, and Bloom is what sells them as lit windows/lamps, so
  // they need to clear its threshold with room to spare. Individual call
  // sites can dial this down where full brightness reads as too intense.
  const dotColor = React.useMemo(
    () => new THREE.Color(color).multiplyScalar(brightness),
    [color, brightness],
  );

  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial color={dotColor} />
    </mesh>
  );
};

// Batched form of NightGlow for the fixture arrays below (dock LEDs,
// parking-lot markers, streetlamp bulbs, building windows), which each
// place dozens to over a hundred identically-sized, identically-coloured
// dots. Rendering each as its own <mesh> was a separate draw call per dot -
// 130 for the dock markers alone, ~165 across every array combined. Since
// every dot in a given array shares geometry, material and color, they're
// exactly what THREE.InstancedMesh exists for: one draw call per array
// instead of one per dot, with per-instance placement done via a matrix
// buffer instead of separate scene-graph nodes.
const NightGlowInstances = ({
  positions,
  color,
  radius,
  brightness = 1.8,
}: {
  positions: [number, number, number][];
  color: string;
  radius: number;
  brightness?: number;
}) => {
  const meshRef = React.useRef<THREE.InstancedMesh>(null!);
  const dotColor = React.useMemo(
    () => new THREE.Color(color).multiplyScalar(brightness),
    [color, brightness],
  );

  React.useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    positions.forEach((position, i) => {
      dummy.position.set(...position);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, positions.length]}
    >
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial color={dotColor} />
    </instancedMesh>
  );
};

// White LED sail floodlights - positioned in the same coordinate space as
// this component's outermost <group position={[0, 0.6, 0]}> below, i.e.
// model-relative rather than world-fixed. These live in mesh.tsx rather
// than the scene-level Canvas specifically so they ride along with
// whatever rotation Inspector applies to the model - a
// spotLight placed at the Canvas/scene level stays fixed in world space and
// visibly stops lining up with the sails as soon as the model is rotated.
//
// An earlier version of this aimed at points derived from the sail mesh's
// axis-aligned bounding-box CORNERS. That massively overshot: the
// Sidney_Stone group's rotation ([-2.7, -1.33, 0.96]) is a large arbitrary
// 3D rotation, so combining raw per-axis min/max into corners and
// transforming those does not track any real point on the mesh - it
// estimated a sail top around y=1.13 in this frame when the real geometry
// only reaches y=0.686. Every light ended up aiming into empty sky above
// the sails, which is why none were visible.
//
// This version reads the actual vertex buffer for the "Sidney_White
// Border_0" mesh (via its GLTF accessor + scene.bin) and transforms every
// real vertex through the same parent-group chain, then picks distinct
// highest-point clusters - guaranteed points ON the sail surface, spread
// across both shell clusters. Each target below is one of those real
// points and doesn't change from here on regardless of where the fixture
// itself sits.
//
// The fixtures themselves sit out on the water rather than at the podium's
// edge, at a real, measured water-surface height and extent (same
// vertex-transform technique applied to "Water_2_water foam_0"). Every
// field below - position, target ("rotation": a spotLight has no rotation
// property of its own, it aims from `position` at `target`, so target x/y/z
// IS the aim control), angle, and intensity - is now fully GUI-adjustable
// per light (see the "Sail Floodlights" panel in sydneyOperaHouse.tsx) via
// the `sailFloodlights` prop below. This array is only the starting point
// for that GUI state, not a fixed layout.
//
// 3 targets sit on the larger (concert hall) shell cluster on the left
// (negative x in this frame); the last 2 sit on the smaller (theatre) shell
// cluster on the right (positive x) - found by reading the actual vertex
// buffer for the "Sidney_White Border_0" mesh (via its GLTF accessor +
// scene.bin), transforming every real vertex through the same parent-group
// chain this component applies, and picking distinct high-point clusters -
// guaranteed points ON the sail surface, not just a bounding-box guess.
export type SailFloodlightConfig = {
  position: [number, number, number];
  target: [number, number, number];
  angle: number;
  intensity: number;
};
export const DEFAULT_SAIL_FLOODLIGHTS: SailFloodlightConfig[] = [
  {
    position: [-1.2, 0.12, -0.22],
    target: [-0.07, 0.9, -0.14],
    angle: 0.48,
    intensity: 15,
  },
  {
    position: [-1.2, 0.12, -0.43],
    target: [-0.46, 0.645, -0.66],
    angle: 0.38,
    intensity: 15,
  },
  {
    position: [-1, 0.12, -0.6],
    target: [-0.73, 0.4, -0.91],
    angle: 0.4,
    intensity: 17,
  },
  {
    position: [1.34, 0.14, -0.38],
    target: [0.15, 0.64, -0.25],
    angle: 0.4,
    intensity: 20,
  },
  {
    position: [1.34, 0.14, -0.38],
    target: [0.08, 0.56, -1.03],
    angle: 0.28,
    intensity: 20,
  },
];
const SAIL_FLOODLIGHT_COLOR = "#f4f9ff";
const SAIL_FLOODLIGHT_PENUMBRA = 0.25;
// Generous relative to the default ~1 unit throw so a fixture dragged
// further out in the GUI doesn't silently run past the falloff cutoff and
// go dark - decay=2 already does the real work of fading it out.
const SAIL_FLOODLIGHT_DISTANCE = 5;

// A spotLight's `.target` only inherits the model's rotation if it's a
// genuinely parented <object3D>, not just a position handed to it via a
// prop - see DockLight below for the same pattern.
const SailFloodlight = ({
  position,
  target,
  angle,
  intensity,
}: SailFloodlightConfig) => {
  // Non-null assertion here (not a real guarantee) purely so the ref's type
  // matches what useHelper expects below - the runtime null-checks in the
  // effect and the JSX below are what actually guard against it being unset.
  const lightRef = React.useRef<THREE.SpotLight>(null!);
  const targetRef = React.useRef<THREE.Object3D>(null);

  React.useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  // Dev-only wireframe cone showing exactly where each fixture is aimed -
  // SpotLightHelper reads the light's live world position/target each frame
  // (added straight to the scene root, not this local group), so it stays
  // correct even as the model rotates.
  // useHelper(IS_DEV && lightRef, THREE.SpotLightHelper);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={SAIL_FLOODLIGHT_COLOR}
        intensity={intensity}
        angle={angle}
        penumbra={SAIL_FLOODLIGHT_PENUMBRA}
        distance={SAIL_FLOODLIGHT_DISTANCE}
        decay={2}
        castShadow={false}
      />
      <object3D ref={targetRef} position={target} />
    </>
  );
};

// Underwater LED dock lighting, traced along the seawall's actual waterline.
//
// The promenade/podium stonework - node "Floor_Stone_0" at gltf node index
// 98 (447 verts, material Stone_0; NOT the ~6270-vert "Floor_Stone_0_1" slab,
// which is the podium's top surface and never crosses the waterline) - is a
// real closed 3D solid. Slicing its vertex buffer at the water's resting
// height (y = 0.08 in this component's coordinate frame - the single most
// common vertex height in "Water_2_water foam_0", i.e. its flat rest plane
// before the wave shader displaces it) produces one clean 60-point closed
// polygon: the literal line where stone meets water. That polygon was
// walked into an ordered loop, arc-length resampled, and each sample's
// outward (into-the-water) direction resolved with a point-in-polygon test
// - the promenade is a peninsula, so "away from the polygon's centroid"
// alone gives the wrong side at several concave stretches of coastline.
//
// Three different resamplings of that one loop feed three different needs:
//  - DOCK_LED_MARKERS: dense, true-to-spec fixture spacing (8 ft), assuming
//    this model's un-scaled units are centimetres - the scene's overall
//    0.0003 scale then implies a ~325 m real perimeter, a plausible size for
//    the promenade around Bennelong Point. Purely visual (see NightGlow
//    above, rendered via NightGlowInstances): 130+ real lights at this
//    density would be a heavy per-fragment cost for every standard-material
//    surface in the scene for no visible gain over the shader-side glow
//    below.
//  - the hand-placed TREE_SIDE/EAST_WALL/SOUTH_WALL/WEST_WALL/NOTCH_DOCK_LIGHT
//    fixtures below: a much sparser set of real spotLights, each given as a
//    percentage along one wall of the loop, for actual beams/highlights on
//    the water surface.
//  - DOCK_GLOW_SAMPLES: a medium-density set consumed by the water shader to
//    paint a continuous underwater glow band - a distance-to-nearest-sample
//    falloff is inherently seamless, which satisfies "no visible dark gaps"
//    far more cheaply (and completely) than any number of discrete lights
//    could.
const DOCK_WATERLINE_Y = 0.08;

// [x, z, outwardX, outwardZ]
const DOCK_LED_MARKERS: [number, number, number, number][] = [
  [-1.1583, 1.1197, 0, 1],
  [-1.0852, 1.1197, 0, 1],
  [-1.0121, 1.1197, 0, 1],
  [-0.939, 1.1197, 0, 1],
  [-0.8658, 1.1197, 0, 1],
  [-0.7927, 1.1197, 0, 1],
  [-0.7196, 1.1197, 0, 1],
  [-0.6465, 1.1197, 0, 1],
  [-0.5734, 1.1197, 0, 1],
  [-0.5002, 1.1197, 0, 1],
  [-0.4271, 1.1197, 0, 1],
  [-0.354, 1.1197, 0, 1],
  [-0.2809, 1.1197, 0, 1],
  [-0.2078, 1.1197, 0, 1],
  [-0.1347, 1.1197, 0, 1],
  [-0.0615, 1.1197, 0, 1],
  [0.0116, 1.1197, 0, 1],
  [0.0847, 1.1197, 0, 1],
  [0.1578, 1.1197, 0, 1],
  [0.2309, 1.1197, 0, 1],
  [0.3041, 1.1197, 0, 1],
  [0.3772, 1.1197, 0, 1],
  [0.4503, 1.1197, 0, 1],
  [0.5234, 1.1197, 0, 1],
  [0.5965, 1.1197, 0, 1],
  [0.6696, 1.1197, 0, 1],
  [0.7428, 1.1197, 0, 1],
  [0.7672, 1.071, 1, 0],
  [0.7672, 0.9979, 1, 0],
  [0.7672, 0.9248, 1, 0],
  [0.7672, 0.8517, 1, 0],
  [0.7672, 0.7785, 1, 0],
  [0.7672, 0.7054, 1, 0],
  [0.813, 0.6782, 0, 1],
  [0.8862, 0.6782, 0, 1],
  [0.9593, 0.6782, 0, 1],
  [1.0324, 0.6782, 0, 1],
  [1.0837, 0.7, -1, 0],
  [1.0837, 0.7731, -1, 0],
  [1.1271, 0.8028, 0, 1],
  [1.2003, 0.8028, 0, 1],
  [1.2283, 0.7578, 1, 0],
  [1.2283, 0.6846, 1, 0],
  [1.2283, 0.6115, 1, 0],
  [1.2283, 0.5384, 1, 0],
  [1.2283, 0.4653, 1, 0],
  [1.2283, 0.3922, 1, 0],
  [1.1976, 0.3498, 0, -1],
  [1.1245, 0.3498, 0, -1],
  [1.0837, 0.3821, -1, 0],
  [1.0837, 0.4552, -1, 0],
  [1.0298, 0.4744, 0, -1],
  [0.9566, 0.4744, 0, -1],
  [0.8835, 0.4744, 0, -1],
  [0.8104, 0.4744, 0, -1],
  [0.7672, 0.4445, 1, 0],
  [0.7672, 0.3714, 1, 0],
  [0.7672, 0.2983, 1, 0],
  [0.7672, 0.2251, 1, 0],
  [0.7672, 0.152, 1, 0],
  [0.7672, 0.0789, 1, 0],
  [0.7672, 0.0058, 1, 0],
  [0.7672, -0.0673, 1, 0],
  [0.7672, -0.1404, 1, 0],
  [0.7672, -0.2136, 1, 0],
  [0.7672, -0.2867, 1, 0],
  [0.7672, -0.3598, 1, 0],
  [0.7672, -0.4329, 1, 0],
  [0.7672, -0.506, 1, 0],
  [0.7672, -0.5792, 1, 0],
  [0.7672, -0.6523, 1, 0],
  [0.7672, -0.7254, 1, 0],
  [0.7672, -0.7985, 1, 0],
  [0.7672, -0.8716, 1, 0],
  [0.7672, -0.9447, 1, 0],
  [0.7672, -1.0179, 1, 0],
  [0.7672, -1.091, 1, 0],
  [0.7395, -1.1392, 0.1044, -0.9945],
  [0.6668, -1.1468, 0.1044, -0.9945],
  [0.5941, -1.1545, 0.1044, -0.9945],
  [0.5322, -1.1895, 0.6034, -0.7975],
  [0.4732, -1.2327, 0.5476, -0.8368],
  [0.412, -1.2728, 0.5476, -0.8368],
  [0.3508, -1.3128, 0.5476, -0.8368],
  [0.2862, -1.3462, 0.3759, -0.9267],
  [0.2184, -1.3737, 0.3759, -0.9267],
  [0.1507, -1.4012, 0.3759, -0.9267],
  [0.0802, -1.4196, 0.1906, -0.9817],
  [0.0084, -1.4335, 0.1906, -0.9817],
  [-0.0635, -1.4459, 0, -1],
  [-0.1366, -1.4459, 0, -1],
  [-0.2097, -1.4459, 0, -1],
  [-0.2828, -1.4459, 0, -1],
  [-0.355, -1.4348, -0.18, -0.9837],
  [-0.4269, -1.4217, -0.18, -0.9837],
  [-0.4971, -1.4046, -0.5977, -0.8017],
  [-0.5557, -1.3609, -0.5977, -0.8017],
  [-0.6104, -1.313, -0.7678, -0.6407],
  [-0.6573, -1.2569, -0.7678, -0.6407],
  [-0.6939, -1.1952, -0.9552, -0.2959],
  [-0.7143, -1.125, -0.9658, -0.2592],
  [-0.7332, -1.0544, -0.9658, -0.2592],
  [-0.7667, -0.9979, -0.2863, -0.9581],
  [-0.8368, -0.9769, -0.2863, -0.9581],
  [-0.8522, -0.9154, -1, 0],
  [-0.8522, -0.8422, -1, 0],
  [-0.8522, -0.7691, -1, 0],
  [-0.8522, -0.696, -1, 0],
  [-0.8522, -0.6229, -1, 0],
  [-0.8522, -0.5498, -1, 0],
  [-0.8522, -0.4766, -1, 0],
  [-0.8522, -0.4035, -1, 0],
  [-0.8522, -0.3304, -1, 0],
  [-0.8522, -0.2573, -1, 0],
  [-0.8522, -0.1842, -1, 0],
  [-0.8522, -0.1111, -1, 0],
  [-0.8849, -0.0595, -0.3927, -0.9196],
  [-0.92, -0.0096, -1, 0],
  [-0.92, 0.0635, -1, 0],
  [-0.92, 0.1366, -1, 0],
  [-0.92, 0.2098, -1, 0],
  [-0.92, 0.2829, -1, 0],
  [-0.92, 0.356, -1, 0],
  [-0.92, 0.4291, -1, 0],
  [-0.8678, 0.4677, -0.3927, 0.9196],
  [-0.8763, 0.5252, -0.9035, -0.4285],
  [-0.9077, 0.5912, -0.9035, -0.4285],
  [-0.939, 0.6573, -0.9035, -0.4285],
  [-0.9703, 0.7234, -0.9035, -0.4285],
  [-1.0017, 0.7894, -0.9035, -0.4285],
  [-1.033, 0.8555, -0.9035, -0.4285],
  [-1.0643, 0.9216, -0.9035, -0.4285],
  [-1.0956, 0.9876, -0.9035, -0.4285],
  [-1.127, 1.0537, -0.9035, -0.4285],
];

// Real dock spotlights - a sparse, hand-placed set of fixtures, each given
// as a percentage along one wall of the DOCK_LED_MARKERS loop above (walked
// in the same direction: increasing marker index runs left-to-right/start-
// to-end of each wall) rather than a raw [x, z] pair, so a wall's fixture
// count/spacing can be retuned without hand-computing new coordinates.
// Straight walls are interpolated as a straight line; the curved south wall
// is arc-length interpolated along the actual marker polyline instead.
//
// Tree-line/stairs wall: z=1.1197, x=-1.1583 to x=0.7428 (a 1.9011 unit
// straight run).
const TREE_SIDE_DOCK_LIGHT_A: [number, number, number, number] = [
  -0.588, 1.1197, 0, 1,
]; // 30% along the run
const TREE_SIDE_DOCK_LIGHT_B: [number, number, number, number] = [
  0.1725, 1.1197, 0, 1,
]; // 70% along the run

// East wall, immediately 90° clockwise from the tree-line/stairs wall:
// x=0.7672, z=0.4445 to z=-1.091 (a 1.5355 unit straight run).
const EAST_WALL_DOCK_LIGHT_A: [number, number, number, number] = [
  0.7672, 0.1374, 1, 0,
]; // 20% along the run
const EAST_WALL_DOCK_LIGHT_B: [number, number, number, number] = [
  0.7672, -0.6304, 1, 0,
]; // 70% along the run

// South wall - the curved run rounding the promenade's southern tip, from
// the east wall's end (0.7672, -1.091) to the west wall's start
// (-0.8522, -0.9154); ~2.007 units of actual polyline.
const SOUTH_WALL_DOCK_LIGHT_A: [number, number, number, number] = [
  0.3424, -1.3171, 0.3759, -0.9267,
]; // 25% along the run
const SOUTH_WALL_DOCK_LIGHT_B: [number, number, number, number] = [
  -0.5268, -1.3825, -0.5977, -0.8017,
]; // 70% along the run

// West wall, from the south wall's end to where the loop turns onto the
// diagonal run back up toward the tree line. x steps from -0.8522 to -0.92
// partway through, but the step (0.0327 units) is small enough that this
// still reads as one straight wall (~1.365 units of actual polyline).
const WEST_WALL_DOCK_LIGHT_A: [number, number, number, number] = [
  -0.8522, -0.6424, -1, 0,
]; // 20% along the run
const WEST_WALL_DOCK_LIGHT_B: [number, number, number, number] = [
  -0.92, 0.0196, -1, 0,
]; // 70% along the run

// The short diagonal run connecting the west wall's end back up to the
// tree-line wall's start (-0.92, 0.4291) to (-1.1583, 1.1197); ~0.781 units
// of actual polyline, arc-length interpolated same as the south wall above.
const NOTCH_DOCK_LIGHT: [number, number, number, number] = [
  -0.991, 0.7669, -0.9035, -0.4285,
]; // 50% along the run (the middle)

const THINNED_DOCK_SPOTLIGHT_POSITIONS = [
  TREE_SIDE_DOCK_LIGHT_A,
  TREE_SIDE_DOCK_LIGHT_B,
  EAST_WALL_DOCK_LIGHT_A,
  EAST_WALL_DOCK_LIGHT_B,
  SOUTH_WALL_DOCK_LIGHT_A,
  SOUTH_WALL_DOCK_LIGHT_B,
  WEST_WALL_DOCK_LIGHT_A,
  WEST_WALL_DOCK_LIGHT_B,
  NOTCH_DOCK_LIGHT,
];

// [x, z] - deliberately coarser than DOCK_LED_MARKERS; consumed by the water
// shader as a fixed-size uniform array (see WATER_FRAGMENT_SHADER), so this
// count directly sets a per-fragment loop length.
const DOCK_GLOW_SAMPLES: [number, number][] = [
  [-1.1583, 1.1197],
  [-0.8521, 1.1197],
  [-0.5459, 1.1197],
  [-0.2398, 1.1197],
  [0.0664, 1.1197],
  [0.3726, 1.1197],
  [0.6788, 1.1197],
  [0.7672, 0.9019],
  [0.8496, 0.6782],
  [1.0837, 0.7503],
  [1.2283, 0.6938],
  [1.2283, 0.3876],
  [1.0837, 0.4735],
  [0.7784, 0.4744],
  [0.7672, 0.1794],
  [0.7672, -0.1267],
  [0.7672, -0.4329],
  [0.7672, -0.7391],
  [0.7672, -1.0453],
  [0.5577, -1.1702],
  [0.3031, -1.3393],
  [0.0129, -1.4326],
  [-0.292, -1.4459],
  [-0.574, -1.3472],
  [-0.7238, -1.0897],
  [-0.8522, -0.8651],
  [-0.8522, -0.5589],
  [-0.8522, -0.2527],
  [-0.92, 0.0087],
  [-0.92, 0.3149],
  [-0.8959, 0.5664],
  [-1.0271, 0.8431],
];

export type DockLightingConfig = {
  intensity: number;
  angle: number;
  depth: number;
  glowRadius: number;
  glowIntensity: number;
};
export const DEFAULT_DOCK_LIGHTING: DockLightingConfig = {
  intensity: 2,
  angle: 1.045,
  depth: 0.005,
  glowRadius: 0.3,
  glowIntensity: 0.45,
};
const DOCK_LED_COLOR = "#d7f3ff";
const DOCK_LIGHT_COLOR = "#bfe9ff"; // cool marine-grade LED white
const DOCK_LIGHT_PENUMBRA = 0.6;
// Widened from 0.5 (tuned for a denser, evenly-spaced fixture set) to suit
// the sparser hand-placed THINNED_DOCK_SPOTLIGHT_POSITIONS above - the wider
// gaps between fixtures need a proportionally wider pool so coverage still
// overlaps into one continuous glow along the waterline instead of leaving
// visible gaps.
const DOCK_LIGHT_DISTANCE = 0.9;
// How far outward (beam-angle-overlap territory) and how far further down
// the aim target sits, relative to the fixture itself - this is what gives
// the "downward pitch with a slight outward angle" the beam needs to
// actually land in the adjacent water rather than straight down at the wall.
const DOCK_LIGHT_THROW = 0.22;
const DOCK_LIGHT_DROP = 0.16;
// How far below DOCK_WATERLINE_Y the fixture itself sits - shallower than
// dockLighting.depth (0.035 default), which is still used for the target/
// LED markers below. See the comment at the fixture's position calculation
// for why this needs to stay underwater at all.
const DOCK_LIGHT_HEIGHT_OFFSET = 0.015;

const DockLight = ({
  position,
  target,
  intensity,
  angle,
}: {
  position: [number, number, number];
  target: [number, number, number];
  intensity: number;
  angle: number;
}) => {
  const lightRef = React.useRef<THREE.SpotLight>(null!);
  const targetRef = React.useRef<THREE.Object3D>(null);

  // Dev-only wireframe cone showing exactly where each of the 8 dock
  // fixtures sits and what it's aimed at. IS_DEV-gated, so this is a no-op
  // (and zero runtime cost) in production.
  // useHelper(IS_DEV && lightRef, THREE.SpotLightHelper);

  React.useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={DOCK_LIGHT_COLOR}
        intensity={intensity}
        angle={angle}
        penumbra={DOCK_LIGHT_PENUMBRA}
        distance={DOCK_LIGHT_DISTANCE}
        decay={2}
        castShadow={false}
      />
      <object3D ref={targetRef} position={target} />
    </>
  );
};

// Purely-visual markers (see NightGlow above, rendered via
// NightGlowInstances) tracing the pedestrian path and outer perimeter of
// the plaza in front of the building, plus a landscape-island accent by the
// taxi drop-off - same trick as DOCK_LED_MARKERS. Defined in this file's
// shared "outward-facing fixture" coordinate frame (SailFloodlight/
// DockLight's space). The stair, tree and parking-lot real spotlights that
// used to accompany these (GroundUplight) were removed entirely - not a
// THREE.Light, so these markers cost nothing in the fragment-shader light
// loop regardless of how many of them there are.
const PARKING_LOT_MARKER_POSITIONS: [number, number, number][] = [
  [-0.65, 0.155, 0.62],
  [-0.43, 0.155, 0.62],
  [-0.22, 0.155, 0.62],
  [0.0, 0.155, 0.62],
  [0.22, 0.155, 0.62],
  [0.43, 0.155, 0.62],
  [0.65, 0.155, 0.62],
  [-0.7, 0.155, 1.0],
  [-0.42, 0.155, 1.0],
  [-0.14, 0.155, 1.0],
  [0.14, 0.155, 1.0],
  [0.42, 0.155, 1.0],
  [0.6, 0.155, 1.0],
  [0.46, 0.155, 0.72],
];
const LANDSCAPE_LIGHT_COLOR = "#ffbf85"; // ~3000K warm white

// The water mesh's own local position/rotation (matches the
// Water_2_water_foam_0 <mesh> below) - reused here to convert
// DOCK_GLOW_SAMPLES (defined in this file's shared "outward-facing fixture"
// coordinate frame, same as DOCK_LED_MARKERS/SailFloodlight/etc.) into that
// mesh's own raw vertex space, since that's the frame the water shader
// actually computes distances in (see `vLocalXZ` in shader.ts).
const WATER_MESH_LOCAL_POSITION: [number, number, number] = [
  -94.09, -222.05, 49.23,
];
const WATER_MESH_LOCAL_ROTATION: [number, number, number] = [0, Math.PI / 2, 0];

const buildLocalMatrix = (
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

// The chain of groups this file's JSX wraps the whole model in before it
// ever reaches the water mesh's own position/rotation (mirrors, in order,
// the <group rotation=[-PI/2,0,0] scale=0.0003>, <group rotation=[PI/2,0,0]>
// and the "groundwater" <group position=[69.93,-55.57,-44.55]
// rotation=[0,-PI/2,0]> below). Float/Inspector wrap this entire component
// from outside, so they apply identically to both the fixture-frame points
// and the water mesh's raw vertices and cancel out of this conversion -
// nothing here needs to be recomputed per frame.
const COMMON_FRAME_TO_WATER_LOCAL = buildLocalMatrix(
  [0, 0, 0],
  [-Math.PI / 2, 0, 0],
  0.0003,
)
  .multiply(buildLocalMatrix([0, 0, 0], [Math.PI / 2, 0, 0]))
  .multiply(buildLocalMatrix([69.93, -55.57, -44.55], [0, -Math.PI / 2, 0]))
  .multiply(
    buildLocalMatrix(WATER_MESH_LOCAL_POSITION, WATER_MESH_LOCAL_ROTATION),
  )
  .invert();

const DOCK_GLOW_POINTS_WATER_LOCAL = DOCK_GLOW_SAMPLES.map(([x, z]) => {
  const local = new THREE.Vector3(x, DOCK_WATERLINE_Y, z).applyMatrix4(
    COMMON_FRAME_TO_WATER_LOCAL,
  );
  return new THREE.Vector2(local.x, local.z);
});

// The 20 Tree_3_* nodes are the same tree model repeated around the plaza,
// each as its own <group position/rotation scale={2}><mesh/><mesh/></group>
// pair (one mesh for the Trees material, one for the trunk's Wood
// material) - 40 draw calls for what's visually one repeated asset. None of
// this is animated, so instead of rendering each instance as its own scene
// node, every instance's geometry is transformed by its own position/
// rotation/scale (via the same buildLocalMatrix helper the water-glow
// conversion above uses) and merged into a single static BufferGeometry per
// material - see mergedTreeGeometry in the Mesh component below. This is
// exactly what static batching exists for: identical, non-animated meshes
// that only differ by transform cost nothing extra to draw once merged, so
// the GPU submits 2 draw calls instead of 40.
const TREE_INSTANCES: {
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

const useAnimatedWaterMaterial = (
  sourceMaterial: THREE.Material | undefined,
  sunDirection: THREE.Vector3,
  isNight: boolean,
  dockLighting: DockLightingConfig,
) => {
  const waterMaterial = React.useMemo(() => {
    const baseColor =
      (
        sourceMaterial as THREE.MeshStandardMaterial | undefined
      )?.color?.clone() ?? new THREE.Color("#6dc8e0");

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: baseColor },
        uHighlight: { value: new THREE.Color("#b8e5f7") },
        uSunDirection: { value: sunDirection.clone() },
        uNightMix: { value: 0 },
        // uDockGlowPoints is defined in Water_2_water_foam_0's own raw
        // vertex space (see DOCK_GLOW_POINTS_WATER_LOCAL above) - this
        // material is also reused on the smaller per-building water_foam
        // patches, whose local transforms differ, so the glow can land
        // slightly off on those. They're small, distant decorative patches
        // far from the seawall, so the mismatch is not worth a per-mesh
        // material just to correct.
        uDockGlowPoints: { value: DOCK_GLOW_POINTS_WATER_LOCAL },
        uDockGlowColor: { value: new THREE.Color(DOCK_LED_COLOR) },
        uDockGlowRadius: { value: dockLighting.glowRadius },
        uDockGlowIntensity: { value: dockLighting.glowIntensity },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: WATER_VERTEX_SHADER,
      fragmentShader: WATER_FRAGMENT_SHADER,
    });
  }, [sourceMaterial]);

  useFrame(({ clock }) => {
    waterMaterial.uniforms.uTime.value = clock.getElapsedTime();
    // Track the scene's actual directional light so the water's sun/moon
    // glint lines up with the shadows/highlights on the rest of the model.
    waterMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    waterMaterial.uniforms.uNightMix.value = isNight ? 1 : 0;
    waterMaterial.uniforms.uDockGlowRadius.value = dockLighting.glowRadius;
    waterMaterial.uniforms.uDockGlowIntensity.value =
      dockLighting.glowIntensity;
  });

  return waterMaterial;
};

// Every non-glass/water material in the GLTF (ground, pavement, grass,
// stone, roofs, boats...) is baked with warm daytime-sunset colors. A
// strong moon light alone can't make those read as "night" - a pink
// pavement just becomes a *brighter* pink pavement. So at night we also
// desaturate and darken each material's base color and pull it toward a
// cool navy, the way moonlight actually flattens color perception.
const NIGHT_MATERIAL_TINT = new THREE.Color("#39456e");
const NIGHT_TINTED_MATERIALS = new Set(["Glass", "water_foam"]);

const useNightMaterialTint = (
  materials: Record<string, THREE.Material>,
  isNight: boolean,
) => {
  const originalColors = React.useRef(new Map<string, THREE.Color>());

  React.useEffect(() => {
    Object.entries(materials).forEach(([name, material]) => {
      if (NIGHT_TINTED_MATERIALS.has(name)) return;
      const mat = material as THREE.MeshStandardMaterial;
      if (!mat.color) return;

      let original = originalColors.current.get(name);
      if (!original) {
        original = mat.color.clone();
        originalColors.current.set(name, original);
      }

      if (isNight) {
        const hsl = { h: 0, s: 0, l: 0 };
        original.getHSL(hsl);
        mat.color
          .setHSL(hsl.h, hsl.s * 0.2, THREE.MathUtils.clamp(hsl.l * 0.15, 0, 1))
          .lerp(NIGHT_MATERIAL_TINT, 0.55);
      } else {
        mat.color.copy(original);
      }
    });
  }, [materials, isNight]);
};

// MeshLambertMaterial evaluates the same lights as MeshStandardMaterial but
// with a much cheaper pure-diffuse model, skipping the roughness/metalness
// Cook-Torrance BRDF and Fresnel term entirely - real savings multiplied
// across every real light in the scene, which matters most at night when
// ~30 real dynamic lights are active at once (see sydneyOperaHouse.tsx).
// Every material in this GLTF is every mesh's material key that isn't
// handled by its own dedicated material elsewhere in this file (Glass uses
// glassMaterial below for real transmission; water_foam uses
// animatedWaterMaterial, a fully custom shader with no scene-light
// dependency at all - neither participates in this lighting model
// regardless of isNight, so neither is in this list).
//
// This used to be split into two tiers - MeshLambertMaterial for surfaces
// that are barely ever seen (ground, pipes, wheels, rocks), and
// MeshPhongMaterial for the visible "hero" surfaces (building, sails/trim,
// boats, cars, promenade, roofs) to preserve a specular sheen - but Phong's
// Blinn-Phong highlight needed careful shininess/specular tuning to avoid
// blowing out under the sail floodlights (a "modest" first attempt
// multiplied out to over 2x pure white at point-blank range, since Phong's
// specular term isn't energy-conserving the way Standard's roughness-based
// BRDF is). MeshLambertMaterial has no specular term to tune at all, so
// every material - hero or hidden - uses it here for a consistent, simpler
// result.
//
// Applied only at night via heroMaterial() below - the day scene has just
// the 3 base lights (ambient/hemisphere/directional, no sail/dock/
// streetlamp fixtures), so there's no light-count cost to offset there, and
// it swaps back to the GLTF's original untouched MeshStandardMaterial that
// the day look was actually tuned against.
const LAMBERT_MATERIAL_KEYS = [
  "Ground",
  "Ground_0",
  "Ground_1",
  "Pipe_1",
  "wheels",
  "Stone_2",
  "material",
  "Ship",
  "car_0",
  "Trees",
  "Wood",
  "Stone",
  "Stone_0",
  "Stone_1",
  "Stone.1",
  "White_Border",
  "Sidney__0",
  "roof",
];

const useLambertMaterials = (materials: Record<string, THREE.Material>) =>
  React.useMemo(() => {
    const lambertMaterials: Record<string, THREE.MeshLambertMaterial> = {};
    LAMBERT_MATERIAL_KEYS.forEach((key) => {
      const source = materials[key] as THREE.MeshStandardMaterial | undefined;
      if (!source?.color) return;
      const lambert = new THREE.MeshLambertMaterial({
        color: source.color,
        // Every material in this GLTF is double-sided (checked against the
        // source file) - MeshLambertMaterial defaults to THREE.FrontSide,
        // which would silently cull backfaces (thin sail/tree/leaf geometry
        // especially) the Standard material was rendering fine.
        side: THREE.DoubleSide,
      });
      // Re-pointed to the SAME Color instance rather than the copy the
      // constructor made above, so useNightMaterialTint's in-place
      // setHSL/lerp mutations on the source material apply here
      // automatically too - both materials just read the one Color object.
      lambert.color = source.color;
      lambertMaterials[key] = lambert;
    });
    return lambertMaterials;
  }, [materials]);

const Mesh = ({
  sunDirection = DEFAULT_SUN_DIRECTION,
  isNight = false,
  sailFloodlights = DEFAULT_SAIL_FLOODLIGHTS,
  dockLighting = DEFAULT_DOCK_LIGHTING,
  streetlampLighting = DEFAULT_STREETLAMP_LIGHTING,
}: MeshProps) => {
  const { nodes, materials } = useLoader(GLTFLoader, MODEL_PATH);

  useNightMaterialTint(materials, isNight);
  const lambertMaterials = useLambertMaterials(materials);
  // Every LAMBERT_MATERIAL_KEYS mesh below reads its material through this
  // instead of `materials[key]` directly, so the isNight swap happens in
  // exactly one place rather than at each of the ~30 call sites.
  const heroMaterial = (key: string): THREE.Material =>
    isNight ? (lambertMaterials[key] ?? materials[key]) : materials[key];

  // The GLTF "Glass" material is fully opaque (no real transmission); swap in a
  // physically-based transmissive material so windows/glass actually refract.
  // At night it also picks up a warm emissive glow, so every window in the
  // model (opera house, boats, car) reads as lit from within.
  const glassMaterial = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: (materials.Glass as THREE.MeshStandardMaterial).color,
        transmission: 1,
        thickness: 0.4,
        // A near-mirror 0.08 roughness catches a sharp specular hotspot from
        // the sail floodlights that flares up huge whenever Float's gentle
        // bobbing sweeps the surface through the reflection angle. Softening
        // it at night spreads that highlight out instead.
        roughness: isNight ? 0.35 : 0.08,
        ior: 1.5,
        metalness: 0,
        // This IS the "light coming from within" for every window in the
        // model (opera house, boats, car) - no separate glow lights needed,
        // this glass itself is what should read as brightly lit.
        emissive: isNight
          ? new THREE.Color("#ff9d4d")
          : new THREE.Color("#000000"),
        emissiveIntensity: isNight ? 1.4 : 0,
      }),
    [materials.Glass, isNight],
  );

  const sailGeometry = React.useMemo(
    () =>
      smoothSailGeometry((nodes.Sidney_White_Border_0 as THREE.Mesh).geometry),
    [nodes.Sidney_White_Border_0],
  );

  // See TREE_INSTANCES above - each of the 20 trees' geometry is baked into
  // world-local space with its own transform, then merged into one shared
  // BufferGeometry per material. mergeGeometries requires every input to
  // share the same set of vertex attributes; the source meshes already all
  // come from the same "tree" gltf asset repeated 20 times, so this holds
  // without needing to strip/normalize attributes first.
  const mergedTreeGeometry = React.useMemo(() => {
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
      trees: mergeGeometries(treesGeometries),
      wood: mergeGeometries(woodGeometries),
    };
  }, [nodes]);

  const animatedWaterMaterial = useAnimatedWaterMaterial(
    materials.water_foam,
    sunDirection,
    isNight,
    dockLighting,
  );

  const dockLedMarkerPositions = React.useMemo<[number, number, number][]>(
    () =>
      DOCK_LED_MARKERS.map(([x, z]) => [
        x,
        DOCK_WATERLINE_Y - dockLighting.depth,
        z,
      ]),
    [dockLighting.depth],
  );

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
    <group position={[0, 0.6, 0]} dispose={null}>
      {isNight &&
        sailFloodlights.map((floodlight, i) => (
          <SailFloodlight
            key={`sail-floodlight-${i}`}
            position={floodlight.position}
            target={floodlight.target}
            angle={floodlight.angle}
            intensity={floodlight.intensity}
          />
        ))}
      {isNight &&
        THINNED_DOCK_SPOTLIGHT_POSITIONS.map(([x, z, outX, outZ], i) => {
          // Deliberately underwater, not raised to the waterline: the
          // water surface is a raw ShaderMaterial with no `lights: true`,
          // so it never receives light from this fixture at all - what
          // it's actually illuminating is the stone promenade wall behind
          // it, which has a hard geometric edge nearby. Underwater, that
          // edge is seen through the translucent water surface, which
          // blends over it and softens it into a clean-looking pool.
          // Raised above the waterline, the same edge renders with nothing
          // softening it and shows up as a harsh, flat-cut clip instead.
          // DOCK_LIGHT_HEIGHT_OFFSET is a shallower depth than
          // dockLighting.depth (used below for the target/LED markers) -
          // still enough to stay under that softening water surface, but
          // higher than the original depth read as sitting too deep.
          const position: [number, number, number] = [
            x,
            DOCK_WATERLINE_Y - DOCK_LIGHT_HEIGHT_OFFSET,
            z,
          ];
          const target: [number, number, number] = [
            x + outX * DOCK_LIGHT_THROW,
            DOCK_WATERLINE_Y - dockLighting.depth - DOCK_LIGHT_DROP,
            z + outZ * DOCK_LIGHT_THROW,
          ];
          return (
            <DockLight
              key={`dock-spotlight-${i}`}
              position={position}
              target={target}
              intensity={dockLighting.intensity}
              angle={dockLighting.angle}
            />
          );
        })}
      {isNight && (
        <NightGlowInstances
          positions={dockLedMarkerPositions}
          color={DOCK_LED_COLOR}
          radius={0.01}
          brightness={0.8}
        />
      )}
      {/* Stair/tree/parking-lot real spotlights removed entirely - the
          parking-lot markers just below (NightGlowInstances, not a
          THREE.Light) are the only thing left tracing that area, and cost
          nothing in the fragment-shader light loop. */}
      {isNight && (
        <NightGlowInstances
          positions={PARKING_LOT_MARKER_POSITIONS}
          color={LANDSCAPE_LIGHT_COLOR}
          radius={0.01}
          brightness={0.7}
        />
      )}
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.0003}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[588.78, 396.08, 2376.67]}>
            <group position={[912.45, 66.51, -141.47]} rotation={[0, 1.4, 0]}>
              <group
                position={[202.06, 22.85, 492.26]}
                rotation={[0, -Math.PI / 2, 0]}
              >
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_car_0 as THREE.Mesh).geometry
                  }
                  material={heroMaterial("material")}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Glass_0 as THREE.Mesh).geometry
                  }
                  material={glassMaterial}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Pipe_1_0 as THREE.Mesh).geometry
                  }
                  material={heroMaterial("Pipe_1")}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Ship_0 as THREE.Mesh).geometry
                  }
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
              <group
                position={[202.06, 22.85, 492.26]}
                rotation={[0, -Math.PI / 2, 0]}
              >
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_car_0 as THREE.Mesh).geometry
                  }
                  material={heroMaterial("car_0")}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Glass_0 as THREE.Mesh).geometry
                  }
                  material={glassMaterial}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Pipe_1_0 as THREE.Mesh).geometry
                  }
                  material={heroMaterial("Pipe_1")}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Ship_0 as THREE.Mesh).geometry
                  }
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
          <group position={[321.74, 352.86, 2903.36]}>
            {/* All 20 individual Tree_3_* instances (see TREE_INSTANCES)
                render here as 2 merged draw calls instead of 40 separate
                <group><mesh/><mesh/></group> nodes. */}
            <mesh
              castShadow
              receiveShadow
              geometry={mergedTreeGeometry.trees}
              material={heroMaterial("Trees")}
            />
            <mesh
              geometry={mergedTreeGeometry.wood}
              material={heroMaterial("Wood")}
            />
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
          <group position={[904.35, 676.99, 907.95]} rotation={[0, 0.09, 0]}>
            <group
              position={[-1247.34, -400.24, -1058.09]}
              rotation={[0, -0.09, 0]}
            >
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
            <group
              position={[-574.21, 4.03, -2224.25]}
              rotation={[-2.7, -1.33, 0.96]}
            >
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
            <mesh
              castShadow
              receiveShadow
              geometry={
                (nodes.Streetlight_s_White_Border_0 as THREE.Mesh).geometry
              }
              material={heroMaterial("White_Border")}
              position={[-50.42, 58.02, -1712.52]}
              rotation={[Math.PI, 1.5, -Math.PI]}
              scale={2}
            />
            {isNight && (
              <group
                position={[-50.42, 58.02, -1712.52]}
                rotation={[Math.PI, 1.5, -Math.PI]}
                scale={2}
              >
                <NightGlowInstances
                  positions={STREETLAMP_LOCAL_POSITIONS}
                  color="#ff9d4d"
                  radius={45}
                  brightness={0.6}
                />
                {STREETLAMP_LOCAL_POSITIONS.map((lampPosition, i) => (
                  <StreetlampSpot
                    key={`streetlamp-spot-${i}`}
                    position={lampPosition}
                    intensity={streetlampLighting.intensity}
                    angle={streetlampLighting.angle}
                    targetDrop={streetlampLighting.targetDrop}
                    targetForwardOffset={streetlampLighting.targetForwardOffset}
                  />
                ))}
              </group>
            )}
          </group>
          <group
            position={[931.95, 509.87, 1401.82]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <group
              position={[551.39, 89.05, -2587.33]}
              rotation={[0, -1.56, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_1_Pipe_1_0 as THREE.Mesh).geometry}
                material={heroMaterial("Pipe_1")}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_1_White_Border_0 as THREE.Mesh).geometry
                }
                material={heroMaterial("White_Border")}
              />
              <mesh
                geometry={
                  (nodes.Building_1_water_foam_0 as THREE.Mesh).geometry
                }
                material={animatedWaterMaterial}
              />
              {isNight && (
                <NightGlow
                  position={BUILDING_WINDOW_LIGHT_POSITIONS[0]}
                  color="#ff9d4d"
                  radius={80}
                  brightness={2.2}
                />
              )}
            </group>
            <group
              position={[892.26, -49.52, 3663.72]}
              rotation={[0, -0.46, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_1_2_roof_0 as THREE.Mesh).geometry}
                material={heroMaterial("roof")}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_1_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={heroMaterial("White_Border")}
              />
              <mesh
                geometry={
                  (nodes.Building_1_2_water_foam_0 as THREE.Mesh).geometry
                }
                material={animatedWaterMaterial}
              />
              {isNight && (
                <NightGlow
                  position={BUILDING_WINDOW_LIGHT_POSITIONS[1]}
                  color="#ff9d4d"
                  radius={80}
                  brightness={2.2}
                />
              )}
            </group>
            <group
              position={[-4920.47, 45.21, -45.44]}
              rotation={[0, -0.26, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_White_Border_0 as THREE.Mesh).geometry
                }
                material={heroMaterial("White_Border")}
              />
              <mesh
                geometry={(nodes.Building_water_foam_0 as THREE.Mesh).geometry}
                material={animatedWaterMaterial}
              />
              {isNight && (
                <NightGlow
                  position={BUILDING_WINDOW_LIGHT_POSITIONS[2]}
                  color="#ff9d4d"
                  radius={80}
                  brightness={2.2}
                />
              )}
            </group>
            <group
              position={[-775.48, 120.3, -1076.12]}
              rotation={[3.14, 1.57, -3.14]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_2_roof_0 as THREE.Mesh).geometry}
                material={heroMaterial("roof")}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={heroMaterial("White_Border")}
              />
              <mesh
                geometry={
                  (nodes.Building_2_water_foam_0 as THREE.Mesh).geometry
                }
                material={animatedWaterMaterial}
              />
              {isNight && (
                <NightGlow
                  position={BUILDING_WINDOW_LIGHT_POSITIONS[3]}
                  color="#ff9d4d"
                  radius={80}
                  brightness={2.2}
                />
              )}
            </group>
            <group
              position={[-332.83, 120.3, -1076.12]}
              rotation={[3.14, 1.57, -3.14]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_2_2_roof_0 as THREE.Mesh).geometry}
                material={heroMaterial("roof")}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_2_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={heroMaterial("White_Border")}
              />
              <mesh
                geometry={
                  (nodes.Building_2_2_water_foam_0 as THREE.Mesh).geometry
                }
                material={animatedWaterMaterial}
              />
              {isNight && (
                <NightGlow
                  position={BUILDING_WINDOW_LIGHT_POSITIONS[4]}
                  color="#ff9d4d"
                  radius={80}
                  brightness={2.2}
                />
              )}
            </group>
          </group>
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
          <group
            position={[69.93, -55.57, -44.55]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <group
              position={[-94.09, -528.54, 49.23]}
              rotation={[0, Math.PI / 2, 0]}
            >
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
        </group>
      </group>
    </group>
  );
};

export default Mesh;

useGLTF.preload(MODEL_PATH);
