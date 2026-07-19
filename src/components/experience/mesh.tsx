import React from "react";
import * as THREE from "three";
import { useGLTF, useHelper } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
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
const STREETLAMP_SPOT_COLOR = "#ffb066";
const STREETLAMP_SPOT_ANGLE = 0.8;
const STREETLAMP_SPOT_PENUMBRA = 0.65;
// `distance`/`intensity` are literal world-space numbers - three.js does
// NOT rescale them by the parent group's transform the way it does a
// light's position, so these look nothing like the STREETLAMP_LOCAL_POSITIONS
// coordinates even though the light sits in that same local hierarchy.
const STREETLAMP_SPOT_DISTANCE = 0.45;
const STREETLAMP_SPOT_INTENSITY = 0.3;
// How far straight down (in the SAME local, pre-scale units as
// STREETLAMP_LOCAL_POSITIONS) from each lamp head the aim target sits. This
// is local-space, so it DOES get carried through the parent's transform
// along with the light's own position - that's what actually points the
// cone down at the ground instead of off in some arbitrary direction.
const STREETLAMP_TARGET_DROP = 85;
// Horizontal nudge (same local units) applied to the target alongside the
// vertical drop, so the cone rakes forward off the post instead of landing
// in a perfect circle directly underneath it - like a real lamp head
// cantilevered out over the path on an arm.
const STREETLAMP_TARGET_FORWARD_OFFSET = 70;
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
}: {
  position: [number, number, number];
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
      position[0] + (dx / horizontalDist) * STREETLAMP_TARGET_FORWARD_OFFSET,
      position[1] - STREETLAMP_TARGET_DROP,
      position[2] + (dz / horizontalDist) * STREETLAMP_TARGET_FORWARD_OFFSET,
    ];
  }, [position]);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={STREETLAMP_SPOT_COLOR}
        intensity={STREETLAMP_SPOT_INTENSITY}
        angle={STREETLAMP_SPOT_ANGLE}
        penumbra={STREETLAMP_SPOT_PENUMBRA}
        distance={STREETLAMP_SPOT_DISTANCE}
        decay={2}
        castShadow={false}
      />
      <object3D ref={targetRef} position={targetPosition} />
    </>
  );
};

// White LED sail floodlights - positioned in the same coordinate space as
// this component's outermost <group position={[0, 0.6, 0]}> below, i.e.
// model-relative rather than world-fixed. These (and StreetlampSpot above)
// live in mesh.tsx rather than the scene-level Canvas specifically so they
// ride along with whatever rotation Inspector applies to the model - a
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
    position: [-1.424, 0.75, -0.923],
    target: [-0.342, 0.686, -0.379],
    angle: 0.07,
    intensity: 8,
  },
  {
    position: [-0.708, 0.75, -1.588],
    target: [-0.346, 0.629, -0.712],
    angle: 0.07,
    intensity: 8,
  },
  {
    position: [-1.22, 0.75, -1.224],
    target: [-0.424, 0.619, -0.517],
    angle: 0.07,
    intensity: 8,
  },
  {
    position: [1.147, 0.75, -0.76],
    target: [0.363, 0.568, -0.483],
    angle: 0.07,
    intensity: 8,
  },
  {
    position: [1.077, 0.75, -0.925],
    target: [0.405, 0.528, -0.586],
    angle: 0.07,
    intensity: 8,
  },
];
const SAIL_FLOODLIGHT_COLOR = "#f4f9ff";
const SAIL_FLOODLIGHT_PENUMBRA = 0.25;
// Generous relative to the default ~1 unit throw so a fixture dragged
// further out in the GUI doesn't silently run past the falloff cutoff and
// go dark - decay=2 already does the real work of fading it out.
const SAIL_FLOODLIGHT_DISTANCE = 5;

// Same target-parenting fix as StreetlampSpot: a spotLight's `.target` only
// inherits the model's rotation if it's a genuinely parented <object3D>,
// not just a position handed to it via a prop.
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
  useHelper(IS_DEV && lightRef, THREE.SpotLightHelper);

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

const useAnimatedWaterMaterial = (
  sourceMaterial: THREE.Material | undefined,
  sunDirection: THREE.Vector3,
  isNight: boolean,
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

const Mesh = ({
  sunDirection = DEFAULT_SUN_DIRECTION,
  isNight = false,
  sailFloodlights = DEFAULT_SAIL_FLOODLIGHTS,
}: MeshProps) => {
  const { nodes, materials } = useLoader(GLTFLoader, MODEL_PATH);

  useNightMaterialTint(materials, isNight);

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

  const animatedWaterMaterial = useAnimatedWaterMaterial(
    materials.water_foam,
    sunDirection,
    isNight,
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
                  material={materials.material}
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
                  material={materials.Pipe_1}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Ship_0 as THREE.Mesh).geometry
                  }
                  material={materials.Ship}
                />
              </group>
              <mesh
                geometry={(nodes.Wheels_1_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.82, 527.04]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.wheels_1_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.61, 528.68]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.Wheels_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.82, 454.97]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <mesh
                geometry={(nodes.wheels_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
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
                  material={materials.car_0}
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
                  material={materials.Pipe_1}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Ship_0 as THREE.Mesh).geometry
                  }
                  material={materials.Ship}
                />
              </group>
              <mesh
                geometry={(nodes.Wheels_1_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.82, 527.04]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.wheels_1_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.61, 528.68]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.Wheels_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.82, 454.97]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <mesh
                geometry={(nodes.wheels_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.61, 453.33]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </group>
          </group>
          <group position={[321.74, 352.86, 2903.36]}>
            <group
              position={[-301.47, -5.81, 128.39]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_15_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_15_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[1338.04, 42.07, -50.35]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_14_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_14_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[1092.19, -5.81, -81.8]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_13_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_13_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-1735.52, -5.81, -86.69]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_12_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_12_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-1178.98, -5.81, -86.69]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_11_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_11_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2035.27, -5.81, -86.69]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_10_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_10_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[1504, -5.81, 20.7]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_9_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_9_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[25.82, -5.81, 60.52]}
              rotation={[0.11, -0.5, 1.54]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_8_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_8_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[247.29, -5.81, -45]}
              rotation={[0.11, -0.5, 1.54]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_7_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_7_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[725.37, -5.81, 20.7]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_6_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_6_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-609.23, -31.36, 87.11]}
              rotation={[1.22, Math.PI / 2, 0]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_4_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_4_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-329.65, -5.81, -135.03]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_1_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_1_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-880.63, -5.81, 48.82]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[36.92, 72.09, 178.04]}
              rotation={[0, Math.PI / 2, 0]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Grass_Stone_0 as THREE.Mesh).geometry}
                material={materials.Stone}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Grass_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
            </group>
            <group
              position={[443.6, 6.26, 24.37]}
              rotation={[-1.11, 1.41, 2.43]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_3_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_3_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[511.17, -31.36, 23.76]}
              rotation={[1.22, Math.PI / 2, 0]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_2_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_2_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[979.68, 6.26, 40.44]}
              rotation={[-0.28, 0.91, 1.56]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_5_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_5_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2692.46, -5.81, -86.69]}
              rotation={[0.09, -0.06, 1.5]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_16_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_16_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2325.74, -5.81, 98.85]}
              rotation={[0.09, -0.06, 1.5]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_17_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_17_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-1463.47, -5.81, 80.2]}
              rotation={[0.09, -0.06, 1.5]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_18_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_18_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2389.95, 6.26, -139.06]}
              rotation={[-1.11, 1.41, 2.43]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_19_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_19_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
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
                material={materials.Stone_0}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_Stone_0_1 as THREE.Mesh).geometry}
                material={materials.Stone_1}
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
                material={materials.Stone}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sidney_Stone1_0 as THREE.Mesh).geometry}
                material={materials["Stone.1"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={sailGeometry}
                material={materials.White_Border}
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
                material={materials.Sidney__0}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={
                (nodes.Streetlight_s_White_Border_0 as THREE.Mesh).geometry
              }
              material={materials.White_Border}
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
                {STREETLAMP_LOCAL_POSITIONS.map((lampPosition, i) => (
                  <React.Fragment key={`streetlamp-${i}`}>
                    <NightGlow
                      position={lampPosition}
                      color="#ff9d4d"
                      radius={45}
                      brightness={0.6}
                    />
                    <StreetlampSpot position={lampPosition} />
                  </React.Fragment>
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
                material={materials.Pipe_1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_1_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
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
                material={materials.roof}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_1_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
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
                material={materials.White_Border}
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
                material={materials.roof}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
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
                material={materials.roof}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_2_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
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
                material={materials.White_Border}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_Ship_0 as THREE.Mesh).geometry}
                material={materials.Ship}
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
                material={materials.White_Border}
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
                material={materials.White_Border}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_1_Ship_0 as THREE.Mesh).geometry}
                material={materials.Ship}
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
                material={materials.Ground}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_3_Ground_0_1 as THREE.Mesh).geometry}
                material={materials.Ground_0}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_3_Ground_0_2 as THREE.Mesh).geometry}
                material={materials.Ground_1}
              />
            </group>
            <group position={[-90.84, -228.19, 39.01]}>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Stones_2__0 as THREE.Mesh).geometry}
                material={materials.Sidney__0}
                position={[-439.62, 34.01, -1.85]}
                rotation={[Math.PI, Math.PI / 2, 0]}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Water_2_water_foam_0 as THREE.Mesh).geometry}
              material={animatedWaterMaterial}
              position={[-94.09, -222.05, 49.23]}
              rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Stones_Stone_0 as THREE.Mesh).geometry}
              material={materials.Stone_2}
              position={[-770.29, -420.19, 39.78]}
              rotation={[Math.PI, Math.PI / 2, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Pipes1_1_Pipe_1_0 as THREE.Mesh).geometry}
              material={materials.Pipe_1}
              position={[-1493.47, -524.33, -558.15]}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Pipes1_Pipe_1_0 as THREE.Mesh).geometry}
              material={materials.Pipe_1}
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
