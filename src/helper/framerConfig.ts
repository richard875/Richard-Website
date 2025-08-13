import { VariantLabels, TargetAndTransition } from "framer-motion";

type WhileHoverType = VariantLabels | TargetAndTransition;

export const myExpButtonEffect: WhileHoverType = {
  rotate: -12,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 12,
    mass: 0.7,
  },
};

export const resumeCircleButtonEffect: WhileHoverType = {
  rotate: -175,
  scale: 1.07,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    mass: 2,
  },
};

export const ctaEffect = (forward: boolean): WhileHoverType => ({
  x: forward ? 7 : -7,
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 10,
    mass: 1,
  },
});
