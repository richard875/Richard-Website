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
import { myExpButtonEffect } from "../../helper/framerConfig";

// Same pill treatment as the "My Experience" button on the home page
// (src/components/index/bottom.tsx) — white pill, black border/text, a
// chevron that leads in the direction of travel, and a spring rotate on
// hover. Kept as its own component so that button's proven styling can be
// reused elsewhere without touching the home page.
const PillCallToAction = ({
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
    // Fallback transition for whatever whileHover/whileTap leave behind when
    // a gesture ends (e.g. rotate settling back to 0) — see the matching
    // comment on ButtonContainer in bottom.tsx for why this must be a tween.
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    whileHover={myExpButtonEffect}
    whileTap={{
      scale: 0.94,
      transition: { type: "spring", stiffness: 400, damping: 17 },
    }}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <a
      id={`${tagId}_${tagIdStartNum + 1}`}
      href={route}
      className={manualCursor ? "cursor-pointer" : "cursor-none"}
      onClick={(e) => routeTo(e, route, isDarkMode)}
    >
      {!forward && (
        <FontAwesomeIcon
          id={`${tagId}_${tagIdStartNum + 2}`}
          icon={faChevronLeft}
          className="text-black mr-2"
          size="sm"
        />
      )}
      <h2 id={`${tagId}_${tagIdStartNum + 3}`} className="text-black">
        {name}
      </h2>
      {forward && (
        <FontAwesomeIcon
          id={`${tagId}_${tagIdStartNum + 4}`}
          icon={faChevronRight}
          className="text-black ml-2"
          size="sm"
        />
      )}
    </a>
  </Pill>
);

export default PillCallToAction;

const Pill = styled(motion.div)`
  font-size: 16px;
  user-select: none;
  width: fit-content;
  will-change: transform;

  @media ${layout.up.sm} {
    font-size: 18px;
  }

  @media ${layout.up.xxl} {
    font-size: 20px;
  }

  a {
    display: flex;
    align-items: center;
    padding: 7px 15px;
    border-radius: 7px;
    background-color: ${Color.WHITE};
    border: 2.5px solid ${Color.BLACK};
  }
`;
