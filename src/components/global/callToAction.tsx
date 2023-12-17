import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { COLOR } from "../../styles/theme";

const CallToAction = ({
  name,
  setHover,
  isDarkMode,
  navigator,
}: {
  name: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  navigator: (
    event: React.MouseEvent<any, MouseEvent>,
    isDarkMode?: boolean
  ) => void;
}) => {
  return (
    <Cta
      $isDarkMode={isDarkMode}
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        onClick={(e) => navigator(e, isDarkMode)}
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
    $isDarkMode ? COLOR.BRIGHT_GREEN : COLOR.DIM_GREEN};
`;
