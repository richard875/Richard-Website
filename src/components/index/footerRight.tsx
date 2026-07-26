import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import SplitText from "../motion/splitText";

const getTimeInSydney = () =>
  new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  });

const INDICATOR_REVEAL_DELAY = 2.05;
const INDICATOR_REVEAL_DURATION = 0.3;
const SYDNEY_TEXT_REVEAL_DELAY = INDICATOR_REVEAL_DELAY - 0.4;
const SYDNEY_TEXT_REVEAL_DONE = SYDNEY_TEXT_REVEAL_DELAY + 0.1;

const FooterRight = () => {
  const indicatorRef = React.useRef(null);
  const [time, setTime] = React.useState("00:00");

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(indicatorRef.current, {
      duration: INDICATOR_REVEAL_DURATION,
      delay: INDICATOR_REVEAL_DELAY,
      opacity: 0,
    });
  }, []);

  React.useEffect(() => {
    setTime(getTimeInSydney()); // show the real time immediately, not "00:00"
    const interval = setInterval(() => setTime(getTimeInSydney()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Indicator ref={indicatorRef}></Indicator>
      <p className="font-secondary-normal select-none">
        <SplitText as="span" delay={SYDNEY_TEXT_REVEAL_DELAY}>
          Sydney
        </SplitText>
        &nbsp;
        <TimeValue>{time}</TimeValue>
      </p>
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

// The time ticks every second and can't go through SplitText's own
// char-splitting reveal (it would get resplit into detached chars each
// tick — see SplitText.tsx). Instead it mirrors "Sydney"'s reveal via this
// sibling selector: hidden while "Sydney" is still split-ready-but-not-
// in-view, then faded in on the same delay its own characters finish
// appearing on (SYDNEY_TEXT_REVEAL_DONE), so the clock doesn't pop in next to
// a blank gap while "Sydney" is still mid-reveal.
const TimeValue = styled.span`
  opacity: 1;
  transition: opacity 0.2s ease ${SYDNEY_TEXT_REVEAL_DONE}s;

  .split-fade-in.split-ready:not(.is-inview) + & {
    opacity: 0;
    transition: none;
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
