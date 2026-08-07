import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import {
  roundedCtaButtonEffect,
  motionTapEffect,
} from "../../helper/motionConfig";

// Same pill treatment as the "My Experience" button on the home page
// (src/components/index/bottom.tsx) — white pill, black border/text, a
// chevron that leads in the direction of travel, and a spring rotate on
// hover. Kept as its own component so that button's proven styling can be
// reused elsewhere without touching the home page.
//
// Shape/typography split (outer Pill for the pill itself, inner PillText
// for the flex row + responsive font-size) follows the same Badge/BadgeText
// convention as PillCallToAction/ProjectLink (src/components/global/
// pillCallToAction.tsx, src/components/projects/projectLink.tsx). whileTap
// reuses those components' shared motionTapEffect (also NavCircle's/
// BackCircle's) instead of a near-identical inline spring, so every pill/
// circle CTA on the site presses the same way. whileHover keeps this
// component's own roundedCtaButtonEffect rotate — its established, proven
// hover — rather than picking up PillCallToAction's badgeHoverEffect, which
// bakes in a colour invert this always-solid-white pill doesn't do.
const RoundedCallToAction = ({
  name,
  tagId,
  tagIdStartNum,
  route,
  forward = true,
  setHover,
  isDarkMode = true,
  manualCursor = false,
}: {
  name: string;
  tagId: string;
  tagIdStartNum: number;
  route: Route;
  forward?: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode?: boolean;
  manualCursor?: boolean;
}) => (
  <Pill
    id={`${tagId}_${tagIdStartNum}`}
    className="font-secondary-normal"
    // Fallback tween for whatever whileHover/whileTap leave behind once a
    // gesture ends (e.g. rotate settling back to 0 after hover, scale back
    // to 1 after tap) — roundedCtaButtonEffect/motionTapEffect only define the
    // spring transition *into* their own gesture, not the reverse.
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    whileHover={roundedCtaButtonEffect}
    whileTap={motionTapEffect}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <a
      id={`${tagId}_${tagIdStartNum + 1}`}
      href={route}
      className={manualCursor ? "cursor-pointer" : "cursor-none"}
      onClick={(e) => routeTo(e, route, isDarkMode)}
    >
      <PillText>
        {!forward && (
          <FontAwesomeIcon
            id={`${tagId}_${tagIdStartNum + 2}`}
            icon={faChevronLeft}
            className="mr-2"
            size="sm"
          />
        )}
        <h2 id={`${tagId}_${tagIdStartNum + 3}`}>{name}</h2>
        {forward && (
          <FontAwesomeIcon
            id={`${tagId}_${tagIdStartNum + 4}`}
            icon={faChevronRight}
            className="ml-2"
            size="sm"
          />
        )}
      </PillText>
    </a>
  </Pill>
);

export default RoundedCallToAction;

const Pill = styled(motion.div)`
  width: fit-content;
  padding: 7px 15px;
  border-radius: 7px;
  color: ${Color.BLACK};
  background-color: ${Color.WHITE};
  border: 2.5px solid ${Color.BLACK};
  user-select: none;
`;

const PillText = styled.div`
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
