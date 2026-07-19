import React from "react";
import gsap from "gsap";

// Fade-out is quicker than fade-in so it gets out of the way before the
// roll's own motion is even noticeable.
const FLICKER_OUT_DURATION = 0.2;
const FLICKER_IN_DURATION = 0.3;

/**
 * Underline flicker that brackets a HoverRoll: pass the returned
 * `onRollStart`/`onRollComplete` to a HoverRoll, and `ref` to the underline
 * element beside it. The bar fades out the instant a roll starts (in either
 * direction) so it isn't sitting still underneath characters that are
 * mid-flight, then fades back in once the roll has fully settled.
 *
 * GSAP (not framer-motion state) drives this, matching HoverRoll's own
 * imperative approach — it just sets the underline's inline opacity
 * directly, which doesn't fight an entrance initial/animate/transition
 * above it since those only ever run once, on mount.
 */
const useUnderlineFlicker = () => {
  const ref = React.useRef<HTMLElement | null>(null);

  const onRollStart = React.useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      opacity: 0,
      duration: FLICKER_OUT_DURATION,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const onRollComplete = React.useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      opacity: 1,
      duration: FLICKER_IN_DURATION,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  return { ref, onRollStart, onRollComplete };
};

export default useUnderlineFlicker;
