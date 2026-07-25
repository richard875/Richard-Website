import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

// Subtle camera parallax that drifts toward the pointer for a sense of depth.
const useCameraParallax = (parallaxStrength: number) => {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const targetX = state.pointer.x * parallaxStrength;
    const targetY = 2.8 + state.pointer.y * parallaxStrength * 0.4;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      10,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      10,
      delta,
    );
    camera.lookAt(0, 0.5, 0);
  });
};

export default useCameraParallax;
