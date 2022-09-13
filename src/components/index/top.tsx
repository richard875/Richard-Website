import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { COLOR } from "../../styles/theme";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const Top = ({
  setHover,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
}) => {
  const emailRef = React.useRef(null);
  const projectRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(emailRef.current, gsapAnimationIndex(150, 2, 20));
    gsap.from(projectRef.current, gsapAnimationIndex(150, 2, 20));
  }, []);

  return (
    <Container>
      <div
        ref={emailRef}
        className="font-primary-normal overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        hello@richard-lee.com
      </div>
      <div
        ref={projectRef}
        className="font-primary-bold"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        PROJECTS
      </div>
    </Container>
  );
};

export default Top;

const Container = styled.div`
  height: 80px;
  padding-left: 28px;
  padding-right: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30px;
  overflow: hidden;
  border-bottom: 3px solid ${COLOR.BLACK};
`;
