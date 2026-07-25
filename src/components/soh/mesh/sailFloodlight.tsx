import React from "react";
import * as THREE from "three";
import type { SailFloodlightConfig } from "./types";

// White LED sail floodlights - positioned in the same coordinate space as
// Mesh's outermost <group position={[0, 0.6, 0]}>, i.e. model-relative
// rather than world-fixed. These live inside the model rather than at the
// scene level specifically so they ride along with whatever rotation
// Inspector applies to the model - a spotLight placed at the Canvas/scene
// level stays fixed in world space and visibly stops lining up with the
// sails as soon as the model is rotated.
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
// field - position, target ("rotation": a spotLight has no rotation
// property of its own, it aims from `position` at `target`, so target x/y/z
// IS the aim control), angle, and intensity - is fully GUI-adjustable per
// light (see the "Sail Floodlights" panel) via the `sailFloodlights` prop
// threaded down from sydneyOperaHouse.tsx. DEFAULT_SAIL_FLOODLIGHTS (see
// types.ts) is only the starting point for that GUI state, not a fixed
// layout.
//
// 3 targets sit on the larger (concert hall) shell cluster on the left
// (negative x in this frame); the last 2 sit on the smaller (theatre) shell
// cluster on the right (positive x) - found by reading the actual vertex
// buffer for the "Sidney_White Border_0" mesh (via its GLTF accessor +
// scene.bin), transforming every real vertex through the same parent-group
// chain, and picking distinct high-point clusters - guaranteed points ON
// the sail surface, not just a bounding-box guess.
const SAIL_FLOODLIGHT_COLOR = "#f4f9ff";
const SAIL_FLOODLIGHT_PENUMBRA = 0.25;
// Generous relative to the default ~1 unit throw so a fixture dragged
// further out in the GUI doesn't silently run past the falloff cutoff and
// go dark - decay=2 already does the real work of fading it out.
const SAIL_FLOODLIGHT_DISTANCE = 5;

// A spotLight's `.target` only inherits the model's rotation if it's a
// genuinely parented <object3D>, not just a position handed to it via a
// prop - see DockLight for the same pattern.
export const SailFloodlight = ({
  position,
  target,
  angle,
  intensity,
}: SailFloodlightConfig) => {
  // Non-null assertion here (not a real guarantee) purely so the ref's type
  // matches what useHelper expects - the runtime null-checks in the effect
  // and the JSX below are what actually guard against it being unset.
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
