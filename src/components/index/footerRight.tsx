import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const getTimeInSydney = () =>
  new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  });

const FooterRight = () => {
  const timeRef = React.useRef(null);
  const [time, setTime] = React.useState("00:00");

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(timeRef.current, 1, gsapAnimationIndex(150, 1, 20));
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => setTime(getTimeInSydney()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container ref={timeRef}>
      <Indicator></Indicator>
      <p className="font-secondary-normal select-none">Sydney&nbsp;{time}</p>
    </Container>
  );
};

export default FooterRight;

const Container = styled.div`
  font-size: 17px;
  display: flex;
  align-items: center;
  margin-right: 15px;

  @media ${layout.up.xxl} {
    font-size: 18px;
  }
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 7px;
  border-radius: 99px;
  background: ${Color.DIM_GREEN};
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
