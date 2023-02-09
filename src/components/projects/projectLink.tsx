import * as React from "react";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { COLOR } from "../../styles/theme";

const ProjectLink = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Cta className="font-secondary-normal">
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2"
      >
        View Project
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

const Cta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 5px;
  color: ${COLOR.DIM_GREEN};
  font-size: 16px;

  ${up("md")} {
    margin-left: 0;
  }

  ${up("xxxl")} {
    font-size: 18px;
  }
`;
