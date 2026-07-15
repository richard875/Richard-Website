import React from "react";
import gsap from "gsap";
import styled, { keyframes } from "styled-components";
import useIsDesktop from "../../hooks/useIsDesktop";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/* Mesh-gradient backdrop, strictly two colors — pink (primary) and
   yellow/orange (secondary), matching the rest of the site's palette.
   Every field is enormous (far bigger than the container) and melts
   into the base wash with pure gradient falloff — no blur filters, no
   banding, no third/white field diluting the palette. Pink breathes on
   a slow transform-only keyframe loop, so the composition never sits
   still but nothing ever darts. Two small SecondaryAccent fields carry
   the yellow/orange elsewhere on the canvas too (echoing the original
   pre-mesh design's five scattered warm clouds) — purely ambient, no
   cursor tie, independent of everything below.

   GoldField (parked hard against the right edge at rest) is the
   cursor-reactive secondary layer, painted above everything else so
   its migration always shows. Three nested elements split the work so
   no property is owned twice: GoldAnchor holds the CSS home position
   (percentages, so it tracks the container's true size even while the
   hero entrance is still scaling it — measuring a px home at mount
   reads the wrong rect) and takes GSAP's x/y/scale toward the pointer;
   GoldWander underneath runs a big, loose ambient CSS roam that keeps
   the field genuinely travelling when the pointer is idle, gone, or
   the device has no pointer at all; GoldField is just the gradient.
   While the pointer is over the component the whole region lazily
   swims after it on a deliberately long, slack lead (following, not
   tracking — see FOLLOW below for why the ease is sine, not a power
   curve); when the pointer leaves the component, it does NOT snap or
   ease back to any home position — GSAP simply stops steering it, and
   it carries on from wherever it was on its own ambient roam, same as
   if the pointer had never touched it. Pointer position feeds a
   rAF-throttled window listener straight into GSAP quickTo — no React
   state, so mouse moves never re-render (or re-run SplitText work in)
   the rest of Bottom's tree. The listener is gated desktop + motion-ok,
   matching the custom cursor's own gate.

   InitialVeil sits on top of all of it, opaque and primary-colored, so
   the very first ~2s read as pure pink with no yellow/orange anywhere,
   then dissolves to reveal the full mesh already in motion underneath.
   Every looping animation starts and ends on the same frame, so the
   global reduced-motion kill-switch resolves this to a static
   two-color mesh (the veil still delays a beat, then cuts straight to
   it — see InitialVeil below). */
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

/* Secondary color, but ambient and small — these don't chase the
   cursor, they're just other places the palette's yellow/orange shows
   up (the pre-mesh design had five separate warm clouds scattered
   around; this brings that "multiple places" quality back without
   touching any of GoldField's interactive behavior above). Same
   yellow-to-orange formula as GoldField, no white. */
const accentDriftA = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-6vmax, 5vmax, 0) scale(1.1);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const SecondaryAccentA = styled(Field)`
  top: -8%;
  left: 20%;
  width: 70vmax;
  height: 70vmax;
  margin: -35vmax 0 0 -35vmax;
  background: radial-gradient(
    circle,
    rgba(255, 205, 70, 0.9) 0%,
    rgba(255, 150, 40, 0.5) 42%,
    rgba(255, 150, 40, 0) 68%
  );
  animation: ${accentDriftA} 30s ease-in-out infinite;
`;

const accentDriftB = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(5vmax, -6vmax, 0) scale(0.92);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const SecondaryAccentB = styled(Field)`
  top: 96%;
  left: -2%;
  width: 62vmax;
  height: 62vmax;
  margin: -31vmax 0 0 -31vmax;
  background: radial-gradient(
    circle,
    rgba(255, 205, 70, 0.85) 0%,
    rgba(255, 150, 40, 0.45) 42%,
    rgba(255, 150, 40, 0) 68%
  );
  animation: ${accentDriftB} 26s ease-in-out -8s infinite;
`;

/* Gold's CSS home — percentages, never a px measurement (see header
   comment) — parked hard against the right edge. GSAP owns this
   element's transform (x/y offset from home plus a hover swell); it is
   a 0×0 point, so children center on it without touching the animated
   property. */
const GoldAnchor = styled.div`
  position: absolute;
  top: 78%;
  left: 94%;
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
   paint order so its travels always read against pink. Core opacity is
   deliberately held below 1 (and the next stop scaled down with it, so
   the falloff stays smooth) — at full opacity the bright yellow center
   read as a blown-out sun/highlight instead of a color field. */
const GoldField = styled.div`
  position: absolute;
  top: -75vmax;
  left: -75vmax;
  width: 150vmax;
  height: 150vmax;
  background: radial-gradient(
    circle,
    rgba(255, 214, 64, 0.78) 0%,
    rgba(250, 176, 40, 0.7) 28%,
    rgba(255, 138, 46, 0.48) 50%,
    rgba(255, 138, 46, 0) 68%
  );
`;

/* Opaque primary-color curtain, painted last (topmost) so it fully
   hides every secondary field underneath for the opening beat — the
   page reads as pure pink before any yellow/orange appears at all.
   Reuses hues already in the palette (base wash's pink end + the pink
   field's magenta) so the reveal doesn't jump to a different pink.
   `forwards` holds it at opacity 0 (i.e. gone) once the fade finishes
   instead of resetting; the reduced-motion kill-switch compresses the
   fade itself to ~0ms but leaves the 2s delay alone, so that case still
   waits, then cuts straight to the full mesh instead of animating in. */
const veilFade = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const InitialVeil = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ff86b3 0%, #ec207a 100%);
  animation: ${veilFade} 0.9s ease-out 2s forwards;
`;

/* A lazy swim, not a cursor tracker: the field trails the pointer on a
   long, slack lead. sine.out keeps the whole leg gentle rather than
   power curves' punchier initial burst — with quickTo continuously
   re-targeting on every mouse move, a "fast start" ease re-triggers on
   every single move, which is exactly what read as "moves really fast"
   during quick mouse motion even though any one retarget starts slow.
   Longer duration on top of that caps the top speed further. */
const FOLLOW = { duration: 6, ease: "sine.out" };
const SWELL = { duration: 0.8, ease: "power2.out" };
/* Fractions of the backdrop; must match GoldAnchor's CSS top/left,
   since GSAP's x/y are offsets from that home. */
const GOLD_HOME = { x: 0.94, y: 0.78 };
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
      <SecondaryAccentA />
      <SecondaryAccentB />
      <GoldAnchor ref={anchorRef}>
        <GoldWander>
          <GoldField />
        </GoldWander>
      </GoldAnchor>
      <InitialVeil />
    </Backdrop>
  );
};

export default BottomBackdrop;
