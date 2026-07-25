import * as THREE from "three";

export type MeshProps = {
  sunDirection?: THREE.Vector3;
  isNight?: boolean;
  sailFloodlights?: SailFloodlightConfig[];
  dockLighting?: DockLightingConfig;
  streetlampLighting?: StreetlampLightingConfig;
};

// One entry per sail floodlight - position, target ("rotation": a
// spotLight aims from position at target rather than having a rotation
// of its own, so target x/y/z is what the GUI calls Rotation X/Y/Z),
// angle, and intensity are all independently GUI-adjustable per light.
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

// Every dock light shares these same parameters ("identical lighting
// parameters ... across all fixtures for a consistent appearance"), so
// this is one shared config object rather than a per-fixture array.
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

// Same shared-config pattern as DockLightingConfig - all 14 streetlamp
// posts are identical fixtures, so they read from one config object
// rather than a per-fixture array like SailFloodlightConfig.
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
  intensity: 0.6,
  angle: 1.2,
  targetDrop: 170,
  targetForwardOffset: 25,
};
