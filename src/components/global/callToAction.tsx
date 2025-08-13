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
  fromIntro = false,
}: {
  name: string;
  tagId: string;
  tagIdStartNum: number;
  forward: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  route: Route;
  isDarkMode?: boolean;
  fromIntro?: boolean;
}) => {
  const [ctaHover, setCtaHover] = React.useState(false);

  const handleMouseEnter = () => {
    setHover(true);
    setCtaHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
    setCtaHover(false);
  };

  return (
    <Cta
      id={`${tagId}_${tagIdStartNum}`}
      $forward={forward}
      $isDarkMode={fromIntro ? true : isDarkMode}
      className="font-secondary-normal"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!forward && (
        <motion.div animate={ctaHover ? ctaEffect(forward) : {}}>
          <FontAwesomeIcon
            id={`${tagId}_${tagIdStartNum + 1}`}
            icon={faCircleChevronLeft}
            size={fromIntro ? ("" as any) : "sm"}
            className={`mt-1.5 ${fromIntro ? "mr-2" : "mr-1.5"}`}
          />
        </motion.div>
      )}
      <h2
        id={`${tagId}_${tagIdStartNum + 2}`}
        onClick={(e) => routeTo(e, route, isDarkMode)}
        className={`${
          fromIntro ? "underline-offset-4" : "underline-offset-2"
        } transition-all ease-in-out underline select-none`}
      >
        {name}
      </h2>
      {forward && (
        <motion.div animate={ctaHover ? ctaEffect(forward) : {}}>
          <FontAwesomeIcon
            id={`${tagId}_${tagIdStartNum + 3}`}
            icon={faCircleChevronRight}
            size={fromIntro ? ("" as any) : "sm"}
            className={`mt-2 ${fromIntro ? "ml-2" : "ml-1.5"} `}
          />
        </motion.div>
      )}
    </Cta>
  );
};

export default CallToAction;

const Cta = styled.div<{ $forward: boolean; $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ $forward, $isDarkMode }) =>
    $forward
      ? $isDarkMode
        ? Color.BRIGHT_GREEN
        : Color.DIM_GREEN
      : $isDarkMode
      ? Color.WHITE
      : Color.BLACK};
`;
