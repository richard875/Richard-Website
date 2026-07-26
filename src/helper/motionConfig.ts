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

// The pill-badge CTAs' (PillCallToAction, ProjectLink) hover state: a slight
// grow that holds for the whole hover, and the outline -> solid-fill colour
// invert, in one whileHover so they run as a single coordinated hover
// response. `motionTapEffect` above is reused for the matching tap/click
// feedback.
//
// The wiggle used to live in here too (as a `rotate` keyframe array), but
// whileHover is a gesture animation: Framer cancels/reverses it the instant
// the pointer leaves, so a quick hover-unhover could catch the rotate
// keyframes mid-flight and leave the badge visibly stuck on a tilt. The
// wiggle is now fired separately via `badgeWiggleEffect` + an imperative
// `useAnimationControls().start(...)` on hover-enter (see
// PillCallToAction) so it always plays to completion regardless of how
// briefly the pointer hovers.
export const badgeHoverEffect = (
  fillColor: string,
  textColor: string,
): HoverAndTapType => ({
  scale: 1.06,
  backgroundColor: fillColor,
  color: textColor,
  transition: {
    scale: { type: "spring", stiffness: 400, damping: 12 },
    backgroundColor: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    color: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
});

// One-shot wiggle, triggered imperatively (not via whileHover) so it always
// runs to completion even if the hover ends before it's done — see the note
// on badgeHoverEffect above.
export const badgeWiggleEffect: HoverAndTapType = {
  rotate: [0, -4, 4, -3, 3, 0],
  transition: { duration: 0.5, ease: "easeInOut" },
};

// Entrance for the AI sparkle logo: fades in cleanly while scale + rotate
// spring into place with a light, unhurried overshoot, like it settles and
// gives one gentle wobble — opacity stays smooth so the bounce doesn't flicker.
export const sparkleEntranceEffect = {
  initial: { opacity: 0, scale: 0.3, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  transition: {
    opacity: { duration: 0.5, delay: 0.35, ease: "easeOut" as const },
    scale: {
      type: "spring" as const,
      stiffness: 160,
      damping: 14,
      mass: 1,
      delay: 0.35,
    },
    rotate: {
      type: "spring" as const,
      stiffness: 140,
      damping: 16,
      mass: 1.1,
      delay: 0.35,
    },
  },
};

// One-shot easter egg: a full 360 spin that settles into a little wiggle,
// triggered imperatively via useAnimationControls on hover-enter (same
// pattern as badgeWiggleEffect/PillCallToAction below) so it always plays to
// completion even if the pointer leaves mid-spin — whileHover would
// cancel/reverse a multi-keyframe rotate the instant hover ends, leaving the
// icon stuck mid-turn instead of landing upright.
//
// `base` is the rotation value to animate from (the caller tracks how many
// full turns have accumulated so far and passes that back in) — using an
// absolute run-on value rather than resetting to 0 each time avoids a
// visible snap-back, since rotate(360deg) reads identically to rotate(0deg).
export const sparkleSpinWiggleEffect = (base: number): TargetAndTransition => ({
  rotate: [
    base,
    base + 360,
    base + 344,
    base + 376,
    base + 352,
    base + 364,
    base + 360,
  ],
  transition: {
    duration: 0.9,
    ease: "easeInOut",
    times: [0, 0.55, 0.68, 0.78, 0.87, 0.94, 1],
  },
});
