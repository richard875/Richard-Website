// The "Streetlight_s" mesh bakes every lamp post along the promenade into
// one geometry rather than separate nodes. These (x, z) pairs are every real
// lamp head cluster found by grouping that mesh's vertices by position - 14
// distinct posts. (The clustering that found these used a crude 300-unit
// rounding grid, which split a few single lamp posts across two adjacent
// buckets - those duplicate pairs showed up as two overlapping glow balls on
// the same post and have been merged back into one entry each here.)
export const STREETLAMP_LOCAL_POSITIONS: [number, number, number][] = [
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
// StreetlampLightingConfig, since every one of the 14 posts renders from
// the same object.
export const STREETLAMP_SPOT_COLOR = "#ffb066";
export const STREETLAMP_SPOT_PENUMBRA = 0.65;
// `distance`/`intensity` are literal world-space numbers - three.js does
// NOT rescale them by the parent group's transform the way it does a
// light's position, so these look nothing like the STREETLAMP_LOCAL_POSITIONS
// coordinates even though the light sits in that same local hierarchy.
export const STREETLAMP_SPOT_DISTANCE = 0.45;

// The Sydney Opera House's origin (the Sidney_Stone group's position),
// expressed in this same streetlamp-group local coordinate space. The two
// groups are siblings under the same parent, so this was found by inverting
// the streetlamp group's own position/rotation/scale ([-50.42, 58.02,
// -1712.52], rotation [Math.PI, 1.5, -Math.PI], scale 2) and applying it to
// the opera house group's local position ([-574.21, 4.03, -2224.25]) - the
// shared parent's transform cancels out since both groups sit under it.
// Used to bias every lamp's target horizontally toward the opera house
// instead of one arbitrary shared axis.
export const OPERA_HOUSE_LOCAL_XZ: [number, number] = [273.75, -243.14];
