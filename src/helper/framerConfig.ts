import { VariantLabels, TargetAndTransition } from "framer-motion";

type HoverAndTapType = VariantLabels | TargetAndTransition;

export const roundedCtaButtonEffect: HoverAndTapType = {
  rotate: -12,
  scale: 1.01,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 12,
    mass: 0.7,
  },
};

export const mainCircleButtonEffect: HoverAndTapType = {
  rotate: -175,
  scale: 1.07,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    mass: 2,
  },
};

export const backCircleButtonEffect: HoverAndTapType = {
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
export const motionTapEffect: HoverAndTapType = {
  scale: 0.9,
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 15,
  },
};

// The pill-badge CTAs' (CallToAction, ProjectLink) hover state: a slight
// grow that holds for the whole hover, a tiny one-shot wiggle that plays
// through once and settles back at 0 (not a repeating shake), and the
// outline -> solid-fill colour invert, all in one whileHover so they run as
// a single coordinated hover response. `motionTapEffect` above is reused
// for the matching tap/click feedback.
export const badgeHoverEffect = (
  fillColor: string,
  textColor: string,
): HoverAndTapType => ({
  scale: 1.06,
  rotate: [0, -4, 4, -3, 3, 0],
  backgroundColor: fillColor,
  color: textColor,
  transition: {
    scale: { type: "spring", stiffness: 400, damping: 12 },
    rotate: { duration: 0.5, ease: "easeInOut" },
    backgroundColor: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    color: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
});
