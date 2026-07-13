import React from "react";
import styled, { keyframes } from "styled-components";

/* Animated backdrop: a revolving color field. The original diagonal
   gradient (Sweep) spins about the center, so the gold and pink bands
   continuously trade sides instead of being pinned to fixed corners,
   while five heavily-blurred palette clouds ride wide constant-speed
   orbits that carry each color across the whole canvas. Colors stay
   distinct (banded gradient + separate clouds) but never own a side.
   Motion is transform-only (compositor-friendly — the blur is static
   so each cloud rasterizes once), and every loop starts and ends on
   the same frame so the global reduced-motion kill-switch resolves to
   the static gradient. */
const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
`;

const sweepSpin = keyframes`
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
`;

/* 300vmax square (not 200%/200% of the container) so the inscribed
   radius clears the container's corner-to-center distance at every
   rotation angle, even on this very wide-and-short (or, on mobile,
   tall-and-narrow) box — sizing off the container's own width/height
   left corners uncovered mid-spin, flashing the static base gradient
   through as a seam. */
const Sweep = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300vmax;
  height: 300vmax;
  margin: -150vmax 0 0 -150vmax;
  background: linear-gradient(
    -45deg,
    #f9c41a,
    #f4b942,
    #ff8a50,
    #ff6b9d,
    #f55591,
    #ff6b9d,
    #ff8a50,
    #f4b942,
    #f9c41a
  );
  animation: ${sweepSpin} 24s linear infinite;
  will-change: transform;
`;

const GOLD = "249, 196, 26";
const AMBER = "244, 185, 66";
const ORANGE = "255, 138, 80";
const ROSE = "255, 107, 157";
const PINK = "245, 85, 145";

const Cloud = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  will-change: transform;
`;

/* rotate → translate → counter-rotate = the cloud's center circles its
   anchor at constant speed; linear timing so the motion never pauses. */
const orbitGold = keyframes`
  from {
    transform: rotate(0turn) translateX(20vw) rotate(0turn);
  }
  to {
    transform: rotate(1turn) translateX(20vw) rotate(-1turn);
  }
`;

const GoldCloud = styled(Cloud)`
  top: -15%;
  left: -12%;
  width: 65vmax;
  height: 65vmax;
  background: radial-gradient(
    circle,
    rgba(${GOLD}, 0.9) 0%,
    rgba(${GOLD}, 0.4) 40%,
    rgba(${GOLD}, 0) 70%
  );
  animation: ${orbitGold} 15s linear infinite;
`;

const orbitAmber = keyframes`
  from {
    transform: rotate(0turn) translateX(24vw) rotate(0turn);
  }
  to {
    transform: rotate(-1turn) translateX(24vw) rotate(1turn);
  }
`;

const AmberCloud = styled(Cloud)`
  top: -10%;
  left: 26%;
  width: 42vmax;
  height: 42vmax;
  background: radial-gradient(
    circle,
    rgba(${AMBER}, 0.8) 0%,
    rgba(${AMBER}, 0.35) 40%,
    rgba(${AMBER}, 0) 70%
  );
  animation: ${orbitAmber} 19.5s linear infinite;
`;

const orbitOrange = keyframes`
  from {
    transform: rotate(0turn) translateX(22vw) rotate(0turn);
  }
  to {
    transform: rotate(1turn) translateX(22vw) rotate(-1turn);
  }
`;

const OrangeCloud = styled(Cloud)`
  top: 20%;
  right: 16%;
  width: 55vmax;
  height: 55vmax;
  background: radial-gradient(
    circle,
    rgba(${ORANGE}, 0.85) 0%,
    rgba(${ORANGE}, 0.38) 40%,
    rgba(${ORANGE}, 0) 70%
  );
  animation: ${orbitOrange} 13.5s linear infinite;
`;

const orbitRose = keyframes`
  from {
    transform: rotate(0turn) translateX(26vw) rotate(0turn);
  }
  to {
    transform: rotate(-1turn) translateX(26vw) rotate(1turn);
  }
`;

const RoseCloud = styled(Cloud)`
  bottom: -18%;
  left: 16%;
  width: 48vmax;
  height: 48vmax;
  background: radial-gradient(
    circle,
    rgba(${ROSE}, 0.85) 0%,
    rgba(${ROSE}, 0.38) 40%,
    rgba(${ROSE}, 0) 70%
  );
  animation: ${orbitRose} 18s linear infinite;
`;

const orbitPink = keyframes`
  from {
    transform: rotate(0turn) translateX(20vw) rotate(0turn);
  }
  to {
    transform: rotate(1turn) translateX(20vw) rotate(-1turn);
  }
`;

const PinkCloud = styled(Cloud)`
  right: -14%;
  bottom: -20%;
  width: 62vmax;
  height: 62vmax;
  background: radial-gradient(
    circle,
    rgba(${PINK}, 0.9) 0%,
    rgba(${PINK}, 0.42) 42%,
    rgba(${PINK}, 0) 72%
  );
  animation: ${orbitPink} 16.5s linear infinite;
`;

const BottomBackdrop = () => (
  <Backdrop aria-hidden="true">
    <Sweep />
    <GoldCloud />
    <AmberCloud />
    <OrangeCloud />
    <RoseCloud />
    <PinkCloud />
  </Backdrop>
);

export default BottomBackdrop;
