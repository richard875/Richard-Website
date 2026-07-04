import React from "react";
import gsap from "gsap";
import Lenis from "lenis";
import ScrollTrigger from "gsap/ScrollTrigger";

// Lenis smooth scroll driven by the GSAP ticker, kept in sync with
// ScrollTrigger. Disabled entirely for prefers-reduced-motion users.
const useLenisScroll = () => {
  const lenisRef = React.useRef<Lenis | null>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.115 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
};

export default useLenisScroll;
