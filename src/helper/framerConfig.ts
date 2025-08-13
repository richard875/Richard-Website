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
  rotate: -170,
  scale: 1.07,
  transition: {
    type: "spring",
    stiffness: 450,
    damping: 60,
    mass: 5.5,
    delay: 0,
  },
};

export const ctaEffect = (forward: boolean): WhileHoverType => ({
  x: forward ? 5 : -5,
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 10,
    mass: 1,
  },
});
