import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";
import { COLOR } from "../../styles/theme";

const FooterRight = () => {
  const timeRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(timeRef.current, 1, gsapAnimationIndex(150, 1, 20));
  }, []);

  return (
    <Container ref={timeRef}>
      <Indicator></Indicator>
      <div className="font-secondary-normal">
        Sydney&nbsp;
        {new Date().toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Australia/Sydney",
        })}
      </div>
    </Container>
  );
};

export default FooterRight;

const Container = styled.div`
  font-size: 17px;
  display: flex;
  align-items: center;
  margin-right: 15px;

  ${up("xxl")} {
    font-size: 18px;
  }
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 7px;
  border-radius: 99px;
  background: ${COLOR.DIM_GREEN};

  animation: blink 3s ease-out infinite;

  @keyframes blink {
    0% {
      opacity: 1;
    }
    10% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
