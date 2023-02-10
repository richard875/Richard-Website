import * as React from "react";
import { navigate } from "gatsby";
import styled from "styled-components";
import Route from "../../routes/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { COLOR } from "../../styles/theme";

const CallToAction = ({
  setHover,
  isDarkMode,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  const projects = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault();
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE_SECONDARY;
    navigate(Route.Projects, { state: { x: event.clientX, y: event.clientY } });
  };

  return (
    <Cta
      isDarkMode={isDarkMode}
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        onClick={(e) => projects(e)}
        className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2"
      >
        Projects
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

const Cta = styled.div`
  display: flex;
  align-items: center;
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BRIGHT_GREEN : COLOR.DIM_GREEN};
`;
