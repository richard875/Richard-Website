import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";

const CallToActionForward = ({
  name,
  setHover,
  route,
  isDarkMode = true,
  fromIntro = false,
}: {
  name: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  route: Route;
  isDarkMode?: boolean;
  fromIntro?: boolean;
}) => (
  <Cta
    $isDarkMode={fromIntro ? true : isDarkMode}
    className="font-secondary-normal"
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <div
      onClick={(e) => routeTo(e, route, isDarkMode)}
      className={`${
        fromIntro ? "pr-2 underline-offset-4" : "pr-1.5 underline-offset-2"
      } hover:pr-3 transition-all ease-in-out underline select-none`}
    >
      {name}
    </div>
    <FontAwesomeIcon
      icon={faCircleChevronRight}
      size={fromIntro ? ("" as any) : "sm"}
      className={fromIntro ? "mt-0.5" : "mt-1"}
    />
  </Cta>
);

export default CallToActionForward;

const Cta = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN};
`;
