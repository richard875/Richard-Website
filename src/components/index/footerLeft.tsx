import React from "react";
import styled from "styled-components";
import layout from "../../styles/layout";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import SplitText from "../motion/splitText";
import { INDEX_TO_ACKNOWLEDGEMENT_DESKTOP } from "../../constants/googleTags";

const FooterLeft = ({
  setHover,
  setTransitionColor,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
  setTransitionColor: React.Dispatch<React.SetStateAction<Color>>;
}) => (
  <Container id={`${INDEX_TO_ACKNOWLEDGEMENT_DESKTOP}_0`}>
    <h2
      id={`${INDEX_TO_ACKNOWLEDGEMENT_DESKTOP}_1`}
      className="font-secondary-normal select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setTransitionColor(Color.BACKGROUND_BLACK)}
    >
      <a
        href={Route.Acknowledgement}
        className="cursor-none"
        onClick={(e) => routeTo(e, Route.Acknowledgement)}
      >
        <SplitText as="span" delay={1.4}>
          Acknowledgement of Country
        </SplitText>
      </a>
    </h2>
  </Container>
);

export default FooterLeft;

const Container = styled.div`
  font-size: 17px;
  display: flex;
  align-items: center;
  margin-left: 15px;

  @media ${layout.up.xxl} {
    font-size: 18px;
  }
`;
