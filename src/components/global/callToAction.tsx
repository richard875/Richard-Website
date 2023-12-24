import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";

const CallToAction = ({
  name,
  setHover,
  route,
  isDarkMode = true,
}: {
  name: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  route: Route;
  isDarkMode?: boolean;
}) => {
  return (
    <Cta
      $isDarkMode={isDarkMode}
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        onClick={(e) => routeTo(e, route, isDarkMode)}
        className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2 select-none"
      >
        {name}
      </div>
      <FontAwesomeIcon
        icon={faCircleChevronRight}
        size={"sm"}
        className="mt-1"
      />
    </Cta>
  );
};

export default CallToAction;

const Cta = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN};
`;
