import * as THREE from "three";
import { buildLocalMatrix } from "../geometryUtils";

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
//    the promenade around Bennelong Point. Purely visual (see NightGlow),
//    rendered via NightGlowInstances: 130+ real lights at this density
//    would be a heavy per-fragment cost for every standard-material surface
//    in the scene for no visible gain over the shader-side glow below.
//  - the hand-placed TREE_SIDE/EAST_WALL/SOUTH_WALL/WEST_WALL/NOTCH_DOCK_LIGHT
//    fixtures below: a much sparser set of real spotLights, each given as a
//    percentage along one wall of the loop, for actual beams/highlights on
//    the water surface.
//  - DOCK_GLOW_SAMPLES: a medium-density set consumed by the water shader to
//    paint a continuous underwater glow band - a distance-to-nearest-sample
//    falloff is inherently seamless, which satisfies "no visible dark gaps"
//    far more cheaply (and completely) than any number of discrete lights
//    could.
export const DOCK_WATERLINE_Y = 0.08;

// [x, z, outwardX, outwardZ]
export const DOCK_LED_MARKERS: [number, number, number, number][] = [
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

export const THINNED_DOCK_SPOTLIGHT_POSITIONS = [
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
export const DOCK_GLOW_SAMPLES: [number, number][] = [
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

export const DOCK_LED_COLOR = "#d7f3ff";
export const DOCK_LIGHT_COLOR = "#bfe9ff"; // cool marine-grade LED white
export const DOCK_LIGHT_PENUMBRA = 0.6;
// Widened from 0.5 (tuned for a denser, evenly-spaced fixture set) to suit
// the sparser hand-placed THINNED_DOCK_SPOTLIGHT_POSITIONS above - the wider
// gaps between fixtures need a proportionally wider pool so coverage still
// overlaps into one continuous glow along the waterline instead of leaving
// visible gaps.
export const DOCK_LIGHT_DISTANCE = 0.9;
// How far outward (beam-angle-overlap territory) and how far further down
// the aim target sits, relative to the fixture itself - this is what gives
// the "downward pitch with a slight outward angle" the beam needs to
// actually land in the adjacent water rather than straight down at the wall.
export const DOCK_LIGHT_THROW = 0.22;
export const DOCK_LIGHT_DROP = 0.16;
// How far below DOCK_WATERLINE_Y the fixture itself sits - shallower than
// dockLighting.depth (0.035 default), which is still used for the target/
// LED markers below. See the comment at the fixture's position calculation
// for why this needs to stay underwater at all.
export const DOCK_LIGHT_HEIGHT_OFFSET = 0.015;

// The water mesh's own local position/rotation (matches the
// Water_2_water_foam_0 <mesh> in GroundAndWater) - reused here to convert
// DOCK_GLOW_SAMPLES (defined in the shared "outward-facing fixture"
// coordinate frame, same as DOCK_LED_MARKERS/SailFloodlight/etc.) into that
// mesh's own raw vertex space, since that's the frame the water shader
// actually computes distances in (see `vLocalXZ` in shader.ts).
export const WATER_MESH_LOCAL_POSITION: [number, number, number] = [
  -94.09, -222.05, 49.23,
];
export const WATER_MESH_LOCAL_ROTATION: [number, number, number] = [
  0,
  Math.PI / 2,
  0,
];

// The chain of groups the model's JSX wraps the whole scene in before it
// ever reaches the water mesh's own position/rotation (mirrors, in order,
// the <group rotation=[-PI/2,0,0] scale=0.0003>, <group rotation=[PI/2,0,0]>
// and the "groundwater" <group position=[69.93,-55.57,-44.55]
// rotation=[0,-PI/2,0]> in GroundAndWater). Float/Inspector wrap this
// entire component from outside, so they apply identically to both the
// fixture-frame points and the water mesh's raw vertices and cancel out of
// this conversion - nothing here needs to be recomputed per frame.
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

export const DOCK_GLOW_POINTS_WATER_LOCAL = DOCK_GLOW_SAMPLES.map(([x, z]) => {
  const local = new THREE.Vector3(x, DOCK_WATERLINE_Y, z).applyMatrix4(
    COMMON_FRAME_TO_WATER_LOCAL,
  );
  return new THREE.Vector2(local.x, local.z);
});
