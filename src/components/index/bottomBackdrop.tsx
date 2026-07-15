import React from "react";
import styled, { keyframes } from "styled-components";

/* Mesh-gradient backdrop, strictly two colors — pink (primary) and
   yellow/orange (secondary), matching the rest of the site's palette.
   Every field is enormous (far bigger than the container) and melts
   into the base wash with pure gradient falloff — no blur filters, no
   banding, no third/white field diluting the palette. Every field is
   purely ambient: each one just wanders its own big, slow, uneven path
   forever, with no connection to the cursor or to each other.

   Pink breathes on a slow drift-and-swell loop. Two small
   SecondaryAccent fields carry the yellow/orange to other spots on the
   canvas too (echoing the original pre-mesh design's five scattered
   warm clouds). GoldField — parked toward the right — is the largest
   and most active of the three secondary fields, so it still reads as
   the "hero" one.

   All three wander keyframes (accentDriftA/B, goldWander) set their OWN
   animation-timing-function on every stop rather than relying on one
   ease-in-out for the whole cycle — a single cycle-level ease only
   shapes the very first and last legs, leaving every stop in between
   interpolating at a near-constant rate, which reads as something
   dragging the field along a fixed path. Per-stop easing decelerates
   into and re-accelerates out of every waypoint individually, so it
   reads as catching a gust, drifting, stalling, catching another — a
   plastic bag on the wind, not a tow rope.

   Every loop starts and ends on the same frame, so the global reduced-
   motion kill-switch resolves this to a static two-color mesh.
   InitialVeil sits on top of all of it, opaque and primary-colored, so
   the very first ~2s read as pure pink with no yellow/orange anywhere,
   then dissolves to reveal the full mesh already in motion underneath
   (the kill-switch compresses the fade itself to ~0ms but leaves the 2s
   delay alone, so that case still waits, then cuts straight to it). */
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

/* Slow drift-and-breathe loop. Distances are small relative to the
   field's size — it leans and swells rather than travels. */
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

/* Secondary color, but small — these are just other places the
   palette's yellow/orange shows up (the pre-mesh design had five
   separate warm clouds scattered around; this brings that "multiple
   places" quality back). Same yellow-to-orange formula as GoldField, no
   white. See the header comment for why every stop sets its own
   animation-timing-function. Amplitude sits a notch below GoldField's
   own wander so it still reads as the most active field, and
   durations/delays are all mismatched on purpose so the three never
   fall into a synchronized rhythm. */
const accentDriftA = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    animation-timing-function: ease-in-out;
  }
  15% {
    transform: translate3d(30vmax, -22vmax, 0) scale(1.18);
    animation-timing-function: ease-in-out;
  }
  35% {
    transform: translate3d(9vmax, -37vmax, 0) scale(0.84);
    animation-timing-function: ease-in-out;
  }
  55% {
    transform: translate3d(-27vmax, -15vmax, 0) scale(1.12);
    animation-timing-function: ease-in-out;
  }
  75% {
    transform: translate3d(-35vmax, 19vmax, 0) scale(0.82);
    animation-timing-function: ease-in-out;
  }
  90% {
    transform: translate3d(-8vmax, 31vmax, 0) scale(1.06);
    animation-timing-function: ease-in-out;
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
  animation: ${accentDriftA} 40s ease-in-out infinite;
`;

const accentDriftB = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    animation-timing-function: ease-in-out;
  }
  18% {
    transform: translate3d(-29vmax, -21vmax, 0) scale(0.83);
    animation-timing-function: ease-in-out;
  }
  40% {
    transform: translate3d(-6vmax, -35vmax, 0) scale(1.2);
    animation-timing-function: ease-in-out;
  }
  62% {
    transform: translate3d(25vmax, -13vmax, 0) scale(0.86);
    animation-timing-function: ease-in-out;
  }
  82% {
    transform: translate3d(31vmax, 17vmax, 0) scale(1.14);
    animation-timing-function: ease-in-out;
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
  animation: ${accentDriftB} 35s ease-in-out -13s infinite;
`;

/* The largest, most active secondary field, parked toward the right
   edge. Core opacity is deliberately held below 1 (and the next stop
   scaled down with it, so the falloff stays smooth) — at full opacity
   the bright yellow center read as a blown-out sun/highlight instead of
   a color field. Swings up to ~46vmax across six uneven stops (not a
   symmetric back-and-forth) so it genuinely ranges across the canvas
   rather than reading as a predictable metronome. */
const goldWander = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    animation-timing-function: ease-in-out;
  }
  16% {
    transform: translate3d(-41vmax, -29vmax, 0) scale(1.24);
    animation-timing-function: ease-in-out;
  }
  33% {
    transform: translate3d(24vmax, -39vmax, 0) scale(0.8);
    animation-timing-function: ease-in-out;
  }
  50% {
    transform: translate3d(45vmax, 17vmax, 0) scale(1.2);
    animation-timing-function: ease-in-out;
  }
  66% {
    transform: translate3d(-15vmax, 37vmax, 0) scale(0.78);
    animation-timing-function: ease-in-out;
  }
  83% {
    transform: translate3d(-39vmax, 8vmax, 0) scale(1.12);
    animation-timing-function: ease-in-out;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const GoldField = styled(Field)`
  top: 78%;
  left: 94%;
  width: 150vmax;
  height: 150vmax;
  margin: -75vmax 0 0 -75vmax;
  background: radial-gradient(
    circle,
    rgba(255, 214, 64, 0.78) 0%,
    rgba(250, 176, 40, 0.7) 28%,
    rgba(255, 138, 46, 0.48) 50%,
    rgba(255, 138, 46, 0) 68%
  );
  animation: ${goldWander} 37s ease-in-out infinite;
`;

/* Opaque primary-color curtain, painted last (topmost) so it fully
   hides every secondary field underneath for the opening beat — the
   page reads as pure pink before any yellow/orange appears at all.
   Reuses hues already in the palette (base wash's pink end + the pink
   field's magenta) so the reveal doesn't jump to a different pink.
   `forwards` holds it at opacity 0 (i.e. gone) once the fade finishes
   instead of resetting. */
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

const BottomBackdrop = () => (
  <Backdrop aria-hidden="true">
    <PinkField />
    <SecondaryAccentA />
    <SecondaryAccentB />
    <GoldField />
    <InitialVeil />
  </Backdrop>
);

export default BottomBackdrop;
