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
    gsap.from(timeRef.current, {
      duration: 1,
      ...gsapAnimationIndex(150, 1.5, 20),
    });
  }, []);

  React.useEffect(() => {
    setTime(getTimeInSydney()); // show the real time immediately, not "00:00"
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
  animation: pulse 2.4s ease-out infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(53, 190, 39, 0.45);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(53, 190, 39, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(53, 190, 39, 0);
    }
  }
`;
