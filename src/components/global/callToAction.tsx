import React from "react";
import styled from "styled-components";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";

const CallToAction = ({
  name,
  forward,
  setHover,
  route,
  isDarkMode = true,
  fromIntro = false,
}: {
  name: string;
  forward: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  route: Route;
  isDarkMode?: boolean;
  fromIntro?: boolean;
}) => {
  const styleGenerator = () =>
    fromIntro
      ? forward
        ? "pr-2 hover:pr-3 underline-offset-4"
        : "pl-2 hover:pl-3 underline-offset-4"
      : forward
      ? "pr-1.5 hover:pr-3 pl-1.5 hover:pl-0 underline-offset-2"
      : "pl-1.5 hover:pl-3 underline-offset-2";

  return (
    <Cta
      $forward={forward}
      $isDarkMode={fromIntro ? true : isDarkMode}
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!forward && (
        <FontAwesomeIcon
          icon={faCircleChevronLeft}
          size={fromIntro ? ("" as any) : "sm"}
          className="mt-0.5"
        />
      )}
      <h2
        onClick={(e) => routeTo(e, route, isDarkMode)}
        className={`${styleGenerator()} transition-all ease-in-out underline select-none`}
      >
        {name}
      </h2>
      {forward && (
        <FontAwesomeIcon
          icon={faCircleChevronRight}
          size={fromIntro ? ("" as any) : "sm"}
          className="mt-0.5"
        />
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
