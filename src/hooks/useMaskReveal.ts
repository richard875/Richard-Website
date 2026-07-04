import React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

type MaskRevealOptions = {
  delay?: number;
  stagger?: number;
  duration?: number;
  // ScrollTrigger start position; omit to play immediately on mount
  start?: string;
};

// Splits an element into lines and raises each line out of an overflow mask —
// the signature headline reveal of the editorial system. Elements should be
// server-rendered with `visibility: hidden` (style or class) to avoid a flash
// before the split runs; this hook makes them visible again in every path.
const useMaskReveal = (
  ref: React.RefObject<HTMLElement | null>,
  options: MaskRevealOptions = {}
) => {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      element.style.visibility = "visible";
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let cancelled = false;
    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;

    // Splitting before webfonts resolve produces wrong line breaks
    document.fonts.ready.then(() => {
      if (cancelled) return;

      split = new SplitText(element, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });
      gsap.set(element, { visibility: "visible" });
      tween = gsap.from(split.lines, {
        yPercent: 115,
        duration: options.duration ?? 1.2,
        ease: "power4.out",
        stagger: options.stagger ?? 0.085,
        delay: options.delay ?? 0,
        scrollTrigger: options.start
          ? { trigger: element, start: options.start, once: true }
          : undefined,
        // Unwrap the masks once the reveal lands, otherwise they keep
        // clipping descenders (Fraunces g / y) forever
        onComplete: () => {
          split?.revert();
          split = null;
        },
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, []);
};

export default useMaskReveal;
