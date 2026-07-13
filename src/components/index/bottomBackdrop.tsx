import React from "react";
import gsap from "gsap";
import styled, { keyframes } from "styled-components";
import useIsDesktop from "../../hooks/useIsDesktop";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/* Mesh-gradient backdrop, strictly two colors — pink (primary) and
   yellow/orange (secondary), matching the rest of the site's palette.
   Each is one enormous, vivid radial field (far bigger than the
   container) melting into the base wash with pure gradient falloff —
   no blur filters, no banding, no third/white field diluting the
   palette. Pink breathes on a slow transform-only keyframe loop, so
   the composition never sits still but nothing ever darts.

   The gold/orange field is the cursor-reactive layer, painted above
   pink so its migration always shows. Three nested elements split the
   work so no property is owned twice: GoldAnchor holds the CSS home
   position (percentages, so it tracks the container's true size even
   while the hero entrance is still scaling it — measuring a px home
   at mount reads the wrong rect) and takes GSAP's x/y/scale toward the
   pointer; GoldWander underneath runs a big, loose ambient CSS roam
   that keeps the field genuinely travelling when the pointer is idle,
   gone, or the device has no pointer at all; GoldField is just the
   gradient. While the pointer is over the component the whole region
   lazily swims after it on a deliberately long, slack lead (following,
   not tracking); when the pointer leaves the component, it does NOT
   snap or ease back to any home position — GSAP simply stops steering
   it, and it carries on from wherever it was on its own ambient roam,
   same as if the pointer had never touched it. Pointer position feeds
   a rAF-throttled window listener straight into GSAP quickTo — no
   React state, so mouse moves never re-render (or re-run SplitText
   work in) the rest of Bottom's tree. The listener is gated desktop +
   motion-ok, matching the custom cursor's own gate. Every loop starts
   and ends on the same frame, so the global reduced-motion kill-switch
   resolves this to a static two-color mesh. */
const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  /* Mid-palette wash so nothing can ever flash through a gap between
     fields. */
  background: linear-gradient(135deg, #ff8d63 0%, #ff86b3 100%);
`;

const Field = styled.div`
  position: absolute;
  will-change: transform;
`;

/* Slow drift-and-breathe loops. Distances are small relative to the
   fields' size — the zones lean and swell rather than travel. */
const pinkDrift = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(6vmax, -5vmax, 0) scale(1.12);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

/* Deep pink/magenta — the palette's primary — owns the left, like the
   reference's violet zone. */
const PinkField = styled(Field)`
  top: 55%;
  left: 8%;
  width: 130vmax;
  height: 130vmax;
  margin: -65vmax 0 0 -65vmax;
  background: radial-gradient(
    circle,
    rgba(236, 32, 122, 1) 0%,
    rgba(236, 32, 122, 0.6) 34%,
    rgba(236, 32, 122, 0) 62%
  );
  animation: ${pinkDrift} 34s ease-in-out infinite;
`;

/* Gold's CSS home — percentages, never a px measurement (see header
   comment). GSAP owns this element's transform (x/y offset from home
   plus a hover swell); it is a 0×0 point, so children center on it
   without touching the animated property. */
const GoldAnchor = styled.div`
  position: absolute;
  top: 78%;
  left: 72%;
  will-change: transform;
`;

/* A real roam, not a light sway — swings up to ~38vmax across six
   uneven stops (not a symmetric back-and-forth) so the field genuinely
   ranges across the canvas and the path never reads as a predictable
   metronome. */
const goldWander = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  16% {
    transform: translate3d(-34vmax, -24vmax, 0) scale(1.2);
  }
  33% {
    transform: translate3d(20vmax, -32vmax, 0) scale(0.86);
  }
  50% {
    transform: translate3d(36vmax, 14vmax, 0) scale(1.14);
  }
  66% {
    transform: translate3d(-12vmax, 30vmax, 0) scale(0.84);
  }
  83% {
    transform: translate3d(-32vmax, 6vmax, 0) scale(1.06);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

/* The ambient roam lives on its own element between anchor and field,
   so the CSS loop composes with (never fights) GSAP's transform on
   the anchor above — the field keeps roaming even mid-follow, parked,
   or on touch devices where the listener never attaches. */
const GoldWander = styled.div`
  position: absolute;
  animation: ${goldWander} 15s ease-in-out infinite;
`;

/* The cursor-reactive secondary color: yellow core cooling to orange
   at the rim, no white/pale stop, so it reads as one clear
   yellow/orange field rather than a gold-and-white wash. Top of the
   paint order so its travels always read against pink. */
const GoldField = styled.div`
  position: absolute;
  top: -50vmax;
  left: -50vmax;
  width: 100vmax;
  height: 100vmax;
  background: radial-gradient(
    circle,
    rgba(255, 214, 64, 1) 0%,
    rgba(250, 176, 40, 0.88) 28%,
    rgba(255, 138, 46, 0.55) 50%,
    rgba(255, 138, 46, 0) 68%
  );
`;

/* A lazy swim, not a cursor tracker: the field trails the pointer on a
   long, slack lead — power1 (gentler than power2's initial snap) so
   the catch-up itself feels unhurried, not just delayed — and keeps
   gliding after it stops. */
const FOLLOW = { duration: 4.2, ease: "power1.out" };
const SWELL = { duration: 0.8, ease: "power2.out" };
/* Fractions of the backdrop; must match GoldAnchor's CSS top/left,
   since GSAP's x/y are offsets from that home. */
const GOLD_HOME = { x: 0.72, y: 0.78 };
const HOVER_SCALE = 1.15;

const BottomBackdrop = () => {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const reactToCursor = isDesktop && !prefersReducedMotion;

  React.useEffect(() => {
    if (!reactToCursor) return;

    const backdrop = backdropRef.current;
    const anchor = anchorRef.current;
    if (!backdrop || !anchor) return;

    const xTo = gsap.quickTo(anchor, "x", FOLLOW);
    const yTo = gsap.quickTo(anchor, "y", FOLLOW);
    const scaleTo = gsap.quickTo(anchor, "scale", SWELL);

    let frame: number | null = null;
    let clientX = 0;
    let clientY = 0;
    let wasInside = false;

    const apply = () => {
      frame = null;
      const rect = backdrop.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (inside) {
        if (!wasInside) {
          wasInside = true;
          scaleTo(HOVER_SCALE);
        }
        xTo(clientX - rect.left - rect.width * GOLD_HOME.x);
        yTo(clientY - rect.top - rect.height * GOLD_HOME.y);
      } else {
        // Deliberately no revert tween here: once the pointer leaves,
        // GSAP just stops steering the field and it carries on from
        // wherever it already was, on its own ambient roam — not a
        // snap or ease back to a fixed home.
        wasInside = false;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame === null) frame = requestAnimationFrame(apply);
    };

    const handleMouseLeave = () => {
      clientX = Number.NEGATIVE_INFINITY;
      clientY = Number.NEGATIVE_INFINITY;
      if (frame === null) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [reactToCursor]);

  return (
    <Backdrop aria-hidden="true" ref={backdropRef}>
      <PinkField />
      <GoldAnchor ref={anchorRef}>
        <GoldWander>
          <GoldField />
        </GoldWander>
      </GoldAnchor>
    </Backdrop>
  );
};

export default BottomBackdrop;
