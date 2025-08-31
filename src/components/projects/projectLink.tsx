import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import { ctaEffect } from "../../helper/framerConfig";
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
  const [ctaHover, setCtaHover] = React.useState(false);
  React.useEffect(() => setHover(ctaHover), [ctaHover]);

  return (
    <Cta
      id={`${PROJECTS_LINK}_${name}_0`}
      className="font-secondary-normal underline underline-offset-2"
      $isDarkMode={isDarkMode}
      onMouseEnter={() => setCtaHover(true)}
      onMouseLeave={() => setCtaHover(false)}
    >
      <a
        id={`${PROJECTS_LINK}_${name}_1`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-none"
      >
        View Project
      </a>
      <motion.div animate={ctaHover ? ctaEffect(true) : {}}>
        <FontAwesomeIcon
          id={`${PROJECTS_LINK}_${name}_2`}
          icon={faCircleChevronRight}
          size="sm"
          className="mt-1.5 ml-1.5"
        />
      </motion.div>
    </Cta>
  );
};

export default ProjectLink;

const Cta = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-left: 5px;
  font-size: 16px;
  user-select: none;
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN};

  @media ${layout.up.md} {
    margin-left: 0;
    margin-top: 20px;
  }

  @media ${layout.up.xxxl} {
    font-size: 18px;
  }
`;
