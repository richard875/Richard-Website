import * as React from "react";
import * as THREE from "three";
import { useDrag } from "react-use-gesture";
import { a, useSpring } from "@react-spring/three";
import { useThree, useFrame } from "@react-three/fiber";

const Inspector = ({
  responsiveness = 20,
  children,
}: {
  responsiveness: number;
  children: any;
}) => {
  const { size } = useThree();
  const euler = React.useMemo(() => new THREE.Euler(), []);
  const [spring, set] = useSpring(() => ({ rotation: [0, 0, 0] }));
  const bind = useDrag(({ delta: [dx, dy] }) => {
    euler.y += (dx / size.width) * responsiveness;
    set({ rotation: euler.toArray().slice(0, 3) as number[] });
  });

  useFrame(() => {
    euler.y -= 0.005;
    set({ rotation: euler.toArray().slice(0, 3) as number[] });
  });

  return (
    <a.group {...bind()} {...spring}>
      {children}
    </a.group>
  );
};

export default Inspector;