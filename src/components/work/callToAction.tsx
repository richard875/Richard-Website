import * as React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { COLOR } from "../../styles/theme";

const CallToAction = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Cta
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2">
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
  color: ${COLOR.DIM_GREEN};
  font-size: 20px;
  margin-bottom: 1px;
`;
