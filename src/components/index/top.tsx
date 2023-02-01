import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
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
        className="font-secondary-normal overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        hello@richard-lee.com
      </div>

      <div
        ref={projectRef}
        className="font-secondary-normal"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        EXPERIENCE
      </div>
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
  border-bottom: 3px solid ${COLOR.BLACK};

  ${up("sm")} {
    font-size: 17px;
  }

  ${up("lg")} {
    height: 60px;
    font-size: 25px;
    padding-left: 28px;
    padding-right: 28px;
  }

  ${up("xxl")} {
    height: 9vh;
    font-size: 30px;
  }
`;
