const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const gsapAnimationIndex = (y: number, delay: number, skewY: number) => {
  if (prefersReducedMotion()) return { y: 0, delay: 0, skewY: 0 };
  return { y, delay, skewY, stagger: { amount: 0.3 } };
};

export default gsapAnimationIndex;
