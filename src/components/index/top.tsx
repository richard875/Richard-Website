import React from "react";
import styled from "styled-components";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import SplitText from "../motion/SplitText";
import { EMAIL } from "../../constants/meta";
import { INDEX_EMAIL, INDEX_TO_CONTACT } from "../../constants/googleTags";

const ENTRANCE_DELAY = 1.2;

const Top = ({
  setHover,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
}) => (
  <Container>
    <div
      id={`${INDEX_EMAIL}_0`}
      className="font-secondary-normal overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        id={`${INDEX_EMAIL}_1`}
        href={`mailto:${EMAIL}`}
        className="cursor-none"
      >
        <SplitText as="span" delay={ENTRANCE_DELAY}>
          {EMAIL}
        </SplitText>
      </a>
    </div>
    <h2
      id={`${INDEX_TO_CONTACT}_0`}
      className="font-secondary-normal select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={Route.Contact}
        className="cursor-none"
        onClick={(e) => routeTo(e, Route.Contact)}
      >
        <SplitText as="span" delay={ENTRANCE_DELAY + 0.2}>
          CONTACT
        </SplitText>
      </a>
    </h2>
  </Container>
);

export default Top;

const Container = styled.div`
  height: 40px;
  font-size: 15px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border-bottom: 3px solid ${Color.BLACK};

  @media ${layout.up.sm} {
    font-size: 17px;
  }

  @media ${layout.up.lg} {
    height: 60px;
    font-size: 25px;
    padding-left: 28px;
    padding-right: 28px;
  }

  @media ${layout.up.xxl} {
    height: 85px;
    font-size: 30px;
  }
`;
