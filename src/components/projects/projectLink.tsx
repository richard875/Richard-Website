import React from "react";
import { useAnimationControls } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import SplitText from "../motion/splitText";
import HoverRoll from "../motion/hoverRoll";
import { Badge, BadgeText } from "../global/pillBadge";
import {
  badgeHoverEffect,
  badgeWiggleEffect,
  motionTapEffect,
} from "../../helper/motionConfig";
import { PROJECTS_LINK } from "../../constants/googleTags";

// Same badge treatment as PillCallToAction's "forward" variant (src/
// components/global/pillCallToAction.tsx) — Badge/BadgeText are shared from
// ../global/pillBadge.tsx since both render the exact same outline-to-fill
// pill, and the accentColor formula matches too: BRIGHT_GREEN on dark
// backgrounds, DIM_GREEN on light ones (BRIGHT_GREEN reads too faint against
// a light page), inverting to BLACK on hover. Kept as its own component
// (rather than reusing PillCallToAction directly) because this one opens an
// external project URL in a new tab instead of doing an internal Gatsby
// route transition.
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
  const wiggleControls = useAnimationControls();

  return (
    <Badge
      id={`${PROJECTS_LINK}_${name}_0`}
      $accentColor={accentColor}
      animate={wiggleControls}
      whileHover={badgeHoverEffect(Color.BRIGHT_GREEN, Color.BLACK)}
      whileTap={motionTapEffect}
      onMouseEnter={() => {
        setHover(true);
        wiggleControls.start(badgeWiggleEffect);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <a
        id={`${PROJECTS_LINK}_${name}_1`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-none"
      >
        <BadgeText className="font-secondary-normal select-none">
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
