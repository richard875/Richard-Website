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
  const dragRotationRef = React.useRef(0);
  const autoRotationRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);

  const [{ scale }, api] = useSpring(() => ({
    scale: [1, 1, 1],
  }));

  const bind = useGesture(
    {
      onDrag: ({ active, first, offset: [y] }) => {
        // Matches the original behaviour: starting a drag discards whatever
        // auto-rotation had accumulated so far and rotation instead tracks
        // the drag offset directly; releasing resumes auto-rotating from
        // wherever the drag left off.
        if (first) autoRotationRef.current = 0;
        dragRotationRef.current = y / 50;
        isDraggingRef.current = active;
        api.start({ scale: active ? [1.1, 1.1, 1.1] : [1, 1, 1] });
      },
    },
    { drag: { preventScroll: true } },
  );

  useFrame((_, delta) => {
    if (!isDraggingRef.current)
      autoRotationRef.current -= AUTO_ROTATION_SPEED * delta;
    meshRef.current.rotation.y =
      dragRotationRef.current + autoRotationRef.current;
  });

  return (
    <a.mesh {...(bind() as any)} ref={meshRef} scale={scale}>
      {children}
    </a.mesh>
  );
};

export default Inspector;
