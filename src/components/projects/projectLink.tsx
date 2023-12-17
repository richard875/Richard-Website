import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import layout from "../../styles/layout";
import { COLOR } from "../../styles/theme";

const ProjectLink = ({
  url,
  setHover,
  isDarkMode,
}: {
  url: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  return (
    <Cta className="font-secondary-normal" $isDarkMode={isDarkMode}>
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2"
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-none"
        >
          View Project
        </a>
      </span>
      <FontAwesomeIcon
        icon={faCircleChevronRight}
        size={"sm"}
        className="mt-1"
      />
    </Cta>
  );
};

export default ProjectLink;

const Cta = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 5px;
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? COLOR.BRIGHT_GREEN : COLOR.DIM_GREEN};
  font-size: 16px;
  user-select: none;

  @media ${layout.up.md} {
    margin-left: 0;
  }

  @media ${layout.up.xxxl} {
    font-size: 18px;
  }
`;
