const gsapAnimationIndex = (y: number, delay: number, skewY: number) => {
  return { y, delay, skewY, stagger: { amount: 0.3 } };
};

export default gsapAnimationIndex;
