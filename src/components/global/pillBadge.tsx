import styled from "styled-components";
import { motion } from "framer-motion";
import Color from "../../enums/color";
import layout from "../../styles/layout";

// Shared pill shape/typography for PillCallToAction (./pillCallToAction.tsx)
// and ProjectLink (../projects/projectLink.tsx) — outline pill that inverts
// to a solid fill via `currentColor` on hover, kept in one place since both
// components render the exact same treatment.
export const Badge = styled(motion.div)<{ $accentColor: Color }>`
  width: fit-content;
  padding: 7px 15px;
  border-radius: 999px;
  background-color: transparent;
  border: 2.5px solid currentColor;
  color: ${({ $accentColor }) => $accentColor};
`;

export const BadgeText = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;

  @media ${layout.up.sm} {
    font-size: 18px;
  }

  @media ${layout.up.xxl} {
    font-size: 20px;
  }
`;
