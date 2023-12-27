import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import { PROJECTS_LINK } from "../../constants/googleTags";

const ProjectLink = ({
  url,
  name,
  setHover,
  isDarkMode,
}: {
  url: string;
  name: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  return (
    <Cta
      id={`${PROJECTS_LINK}_${name}_0`}
      className="font-secondary-normal"
      $isDarkMode={isDarkMode}
    >
      <span
        id={`${PROJECTS_LINK}_${name}_1`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2"
      >
        <a
          id={`${PROJECTS_LINK}_${name}_2`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-none"
        >
          View Project
        </a>
      </span>
      <FontAwesomeIcon
        id={`${PROJECTS_LINK}_${name}_3`}
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
  font-size: 16px;
  user-select: none;
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN};

  @media ${layout.up.md} {
    margin-left: 0;
  }

  @media ${layout.up.xxxl} {
    font-size: 18px;
  }
`;
