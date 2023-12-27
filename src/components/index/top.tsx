import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import { EMAIL } from "../../constants/meta";
import { INDEX_EMAIL } from "../../constants/googleTags";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const Top = ({
  setHover,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
}) => {
  const emailRef = React.useRef(null);
  const projectRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1 });
    gsap.from(emailRef.current, gsapAnimationIndex(150, 1, 20));
    gsap.from(projectRef.current, gsapAnimationIndex(150, 1, 20));
  }, []);

  return (
    <Container>
      <div
        ref={emailRef}
        id={`${INDEX_EMAIL}_0`}
        className="font-secondary-normal overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <a
          id={`${INDEX_EMAIL}_1`}
          className="cursor-none"
          href={`mailto:${EMAIL}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {EMAIL}
        </a>
      </div>
      <h2
        ref={projectRef}
        className="font-secondary-normal select-none"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => routeTo(e, Route.Contact)}
      >
        CONTACT
      </h2>
    </Container>
  );
};

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
    height: 9vh;
    font-size: 30px;
  }
`;
