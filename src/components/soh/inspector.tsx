import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { a, useSpring } from "@react-spring/three";

// Auto-rotation used to be driven by calling the spring's `api.start()` on
// every single useFrame tick - that restarts a full spring transition 60
// times a second (allocating a fresh animation config and re-running the
// spring solver each time) purely to nudge the value by a fixed -0.02, which
// is CPU overhead paid every frame regardless of GPU load. The idle spin is
// now a plain ref mutation applied straight to the mesh's rotation, which is
// as cheap as this can get. The spring is kept only for the drag-triggered
// scale "pop", which changes rarely (on drag start/stop) rather than every
// frame, so calling `.start()` there is fine.
//
// The rotation step itself was (both before and after the above change) a
// fixed amount applied once per rendered frame rather than scaled by actual
// elapsed time - that makes the spin's real-world speed directly
// proportional to FPS. At the ~5fps this scene used to render at, that was
// invisible; now that everything else here renders much faster, the exact
// same per-frame step spins the model visibly faster than it used to look.
// AUTO_ROTATION_SPEED is in rad/sec (0.02 * 60, matching the old per-frame
// step at a plain 60fps reference) and is applied via `delta` below so the
// spin rate is now the same regardless of how fast the scene renders.
const AUTO_ROTATION_SPEED = 0.2;

const Inspector = ({ children }: { children: React.JSX.Element }) => {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  // Single source of truth for the mesh's current Y rotation - both auto-spin
  // and dragging write straight into this same ref, so there's only ever one
  // value representing where the model actually is.
  const rotationRef = React.useRef(0);
  // Snapshot of rotationRef taken the instant a drag starts. Dragging then
  // applies this gesture's `movement` (which always starts at 0) as a delta
  // on top of that snapshot, rather than seeding rotation from use-gesture's
  // `offset` - offset is tracked independently of the mesh's own rotation
  // (e.g. it's 0 on the first drag after any auto-spin), so writing it
  // straight into rotationRef snapped the model to an unrelated angle the
  // instant you clicked. Beta never showed this because rotation lived in a
  // spring there, so retargeting it eased the mismatch away instead of
  // exposing it; the direct ref write here has no such implicit animation.
  const dragBaseRotationRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);

  const [{ scale }, api] = useSpring(() => ({
    scale: [1, 1, 1],
  }));

  const bind = useGesture(
    {
      onDrag: ({ active, first, movement: [mx] }) => {
        if (first) dragBaseRotationRef.current = rotationRef.current;
        rotationRef.current = dragBaseRotationRef.current + mx / 50;
        isDraggingRef.current = active;
        api.start({ scale: active ? [1.1, 1.1, 1.1] : [1, 1, 1] });
      },
    },
    { drag: { preventScroll: true } },
  );

  useFrame((_, delta) => {
    if (!isDraggingRef.current)
      rotationRef.current -= AUTO_ROTATION_SPEED * delta;
    meshRef.current.rotation.y = rotationRef.current;
  });

  return (
    <a.mesh {...(bind() as any)} ref={meshRef} scale={scale}>
      {children}
    </a.mesh>
  );
};

export default Inspector;
