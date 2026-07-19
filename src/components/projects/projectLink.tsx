import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import SplitText from "../motion/SplitText";
import HoverRoll from "../motion/HoverRoll";
import { badgeHoverEffect, motionTapEffect } from "../../helper/framerConfig";
import { PROJECTS_LINK } from "../../constants/googleTags";

// Same badge treatment as PillCallToAction (src/components/global/
// pillCallToAction.tsx) — see that file's comment for the Badge/BadgeText split,
// the outline-to-fill invert, and why the label carries its own
// SplitText + HoverRoll. Colour keeps this component's own green accent
// (bright on dark backgrounds, dimmer on light) rather than IntroBadge's
// fixed white/black.
const ProjectLink = ({
  url,
  name,
  setHover,
  isDarkMode,
}: {
  url: string;
  name: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  const accentColor = isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN;

  return (
    <Badge
      id={`${PROJECTS_LINK}_${name}_0`}
      $accentColor={accentColor}
      whileHover={badgeHoverEffect(Color.BRIGHT_GREEN, Color.BLACK)}
      whileTap={motionTapEffect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        id={`${PROJECTS_LINK}_${name}_1`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-none"
      >
        <BadgeText className="font-secondary-normal font-medium select-none">
          <SplitText as="h3" className="split-fast">
            <HoverRoll>View Project</HoverRoll>
          </SplitText>
          <FontAwesomeIcon
            id={`${PROJECTS_LINK}_${name}_2`}
            icon={faChevronRight}
            size="sm"
            className="ml-2"
          />
        </BadgeText>
      </a>
    </Badge>
  );
};

export default ProjectLink;

const Badge = styled(motion.div)<{ $accentColor: Color }>`
  width: fit-content;
  margin-top: 15px;
  padding: 7px 15px;
  border-radius: 999px;
  background-color: transparent;
  border: 2.5px solid currentColor;
  color: ${({ $accentColor }) => $accentColor};

  @media ${layout.up.md} {
    margin-top: 20px;
  }
`;

const BadgeText = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;

  @media ${layout.up.xxxl} {
    font-size: 18px;
  }
`;
