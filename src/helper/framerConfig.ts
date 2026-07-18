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

export const mainCircleButtonEffect: WhileHoverType = {
  rotate: -175,
  scale: 1.07,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    mass: 2,
  },
};

export const backCircleButtonEffect: WhileHoverType = {
  scale: 1.12,
  rotate: -14,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20,
  },
};

// Shared press/tap feedback for NavCircle and BackCircle — kept identical
// between the two so the pair reads as one connected control surface.
export const circleTapEffect: WhileHoverType = {
  scale: 0.9,
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 15,
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
