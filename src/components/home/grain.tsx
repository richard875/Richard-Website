import React from "react";
import styled from "styled-components";

// Film-grain overlay — a static SVG noise tile at low opacity. Sits above the
// page surface but below the custom cursor (z-index 999).
const Grain = () => <Overlay aria-hidden="true" />;

export default Grain;

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 900;
  pointer-events: none;
  background-image: ${NOISE};
  background-repeat: repeat;
  opacity: 0.045;
`;
