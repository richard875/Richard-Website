import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import { ctaEffect } from "../../helper/framerConfig";

const CallToAction = ({
  name,
  tagId,
  tagIdStartNum,
  forward,
  setHover,
  route,
  isDarkMode = true,
  fromIntroAndPlain = false,
  manualCursor = false,
}: {
  name: string;
  tagId: string;
  tagIdStartNum: number;
  forward: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  route: Route;
  isDarkMode?: boolean;
  fromIntroAndPlain?: boolean;
  manualCursor?: boolean;
}) => {
  const [ctaHover, setCtaHover] = React.useState(false);
  React.useEffect(() => setHover(ctaHover), [ctaHover]);

  return (
    <Cta
      id={`${tagId}_${tagIdStartNum}`}
      $forward={forward}
      $fromIntroAndPlain={fromIntroAndPlain}
      $isDarkMode={fromIntroAndPlain ? true : isDarkMode}
      className="font-secondary-normal select-none underline"
      onMouseEnter={() => setCtaHover(true)}
      onMouseLeave={() => setCtaHover(false)}
    >
      {!forward && (
        <motion.div animate={ctaHover ? ctaEffect(forward) : {}}>
          <FontAwesomeIcon
            id={`${tagId}_${tagIdStartNum + 1}`}
            icon={faCircleChevronLeft}
            size={fromIntroAndPlain ? ("" as any) : "sm"}
            className={`mt-1.5 ${fromIntroAndPlain ? "mr-2" : "mr-1.5"}`}
          />
        </motion.div>
      )}
      <h2 id={`${tagId}_${tagIdStartNum + 2}`}>
        <a
          href={route}
          className={manualCursor ? "cursor-pointer" : "cursor-none"}
          onClick={(e) => routeTo(e, route, isDarkMode)}
        >
          {name}
        </a>
      </h2>
      {forward && (
        <motion.div animate={ctaHover ? ctaEffect(forward) : {}}>
          <FontAwesomeIcon
            id={`${tagId}_${tagIdStartNum + 3}`}
            icon={faCircleChevronRight}
            size={fromIntroAndPlain ? ("" as any) : "sm"}
            className={`mt-2 ${fromIntroAndPlain ? "ml-2" : "ml-1.5"} `}
          />
        </motion.div>
      )}
    </Cta>
  );
};

export default CallToAction;

const Cta = styled.div<{
  $forward: boolean;
  $isDarkMode: boolean;
  $fromIntroAndPlain: boolean;
}>`
  display: flex;
  align-items: center;
  text-underline-offset: ${({ $fromIntroAndPlain }) =>
    $fromIntroAndPlain ? "4px" : "2px"};
  color: ${({ $forward, $isDarkMode }) =>
    $forward
      ? $isDarkMode
        ? Color.BRIGHT_GREEN
        : Color.DIM_GREEN
      : $isDarkMode
        ? Color.WHITE
        : Color.BLACK};
`;
