import React from "react";
import { useFrame } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { a, useSpring } from "@react-spring/three";

const Inspector = ({ children }: { children: React.JSX.Element }) => {
  const [{ rot, scale }, api] = useSpring(() => ({
    rot: [0, 0, 0],
    scale: [1, 1, 1],
  }));

  const bind = useGesture(
    {
      onDrag: ({ active, offset: [y] }) => {
        api.start({
          rot: [0, y / 50, 0],
          scale: active ? [1.1, 1.1, 1.1] : [1, 1, 1],
        });
      },
    },
    { drag: { preventScroll: true } }
  );

  useFrame(() => api.start({ rot: [0, rot.get()[1] - 0.02, 0] }));

  return (
    <a.mesh {...(bind() as any)} rotation={rot} scale={scale}>
      {children}
    </a.mesh>
  );
};

export default Inspector;
