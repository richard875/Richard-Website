// Purely-visual markers (see NightGlow/NightGlowInstances) tracing the
// pedestrian path and outer perimeter of the plaza in front of the
// building, plus a landscape-island accent by the taxi drop-off - same
// trick as DOCK_LED_MARKERS. Defined in the shared "outward-facing fixture"
// coordinate frame (SailFloodlight/DockLight's space). The stair, tree and
// parking-lot real spotlights that used to accompany these (GroundUplight)
// were removed entirely - not a THREE.Light, so these markers cost nothing
// in the fragment-shader light loop regardless of how many of them there are.
export const PARKING_LOT_MARKER_POSITIONS: [number, number, number][] = [
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
export const LANDSCAPE_LIGHT_COLOR = "#ffbf85"; // ~3000K warm white
