import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import ScrollTrigger from "gsap/ScrollTrigger";
import layout from "../../styles/layout";
import useMaskReveal from "../../hooks/useMaskReveal";
import Star from "./star";
import {
  NAME,
  FIRST_NAME,
  LAST_NAME,
  OCCUPATION,
  REGION,
} from "../../constants/meta";

const getTimeInSydney = () =>
  new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  });

const Hero = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const firstRef = React.useRef<HTMLDivElement>(null);
  const lastRef = React.useRef<HTMLDivElement>(null);
  const starRef = React.useRef<HTMLDivElement>(null);
  const roleRef = React.useRef<HTMLParagraphElement>(null);
  const metaRef = React.useRef<HTMLDivElement>(null);
  const [time, setTime] = React.useState("00:00");

  // 0.75s — arrive after the InitialTransition wipe clears
  useMaskReveal(firstRef, { delay: 0.75 });
  useMaskReveal(lastRef, { delay: 0.87 });
  useMaskReveal(roleRef, { delay: 1.05 });

  React.useEffect(() => {
    setTime(getTimeInSydney());
    const interval = setInterval(() => setTime(getTimeInSydney()), 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.from(metaRef.current, {
        autoAlpha: 0,
        y: 18,
        duration: 1,
        delay: 1.35,
        ease: "power3.out",
      });

      if (reduced) return;

      // Scroll choreography: the name lines shear apart, the star keeps time
      const scrub = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(firstRef.current, { xPercent: -5, scrollTrigger: scrub });
      gsap.to(lastRef.current, { xPercent: 4, scrollTrigger: scrub });
      gsap.to(starRef.current, { rotation: 240, scrollTrigger: scrub });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef}>
      <h1 className="sr-only">
        {NAME} — {OCCUPATION}, {REGION}
      </h1>
      <NameBlock aria-hidden="true">
        <NameLine
          ref={firstRef}
          className="font-display line-mask"
          style={{ visibility: "hidden" }}
        >
          {FIRST_NAME.toUpperCase()}
        </NameLine>
        <LastLineRow>
          <StarWrap ref={starRef}>
            <Star size="clamp(26px, 4.2vw, 64px)" color="var(--gold)" />
          </StarWrap>
          <NameLine
            ref={lastRef}
            className="font-display line-mask"
            style={{ visibility: "hidden" }}
          >
            {LAST_NAME.toUpperCase()}
          </NameLine>
        </LastLineRow>
      </NameBlock>
      <Role
        ref={roleRef}
        className="font-text line-mask"
        style={{ visibility: "hidden" }}
      >
        Software engineer &amp; <em className="font-accent">creative</em>{" "}
        technologist — building digital products where craft carries the
        message.
      </Role>
      <MetaRow ref={metaRef} className="font-label">
        <span>Sydney — 33.8688° S, 151.2093° E</span>
        <Availability>
          <Pulse aria-hidden="true" />
          Open to interesting problems
        </Availability>
        <span>Local time {time} AEST</span>
        <ScrollCue aria-hidden="true">Scroll ↓</ScrollCue>
      </MetaRow>
    </Section>
  );
};

export default Hero;

const Section = styled.section`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 var(--gutter) 26px;
  background: var(--paper);
  color: var(--ink);
  overflow: hidden;
`;

const NameBlock = styled.div`
  user-select: none;
`;

const NameLine = styled.div`
  font-size: clamp(46px, 14.6vw, 270px);
  line-height: 0.88;
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

const LastLineRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: clamp(14px, 2.5vw, 44px);
`;

const StarWrap = styled.div`
  display: flex;
  align-items: center;
  transform-origin: center;
  translate: 0 clamp(-8px, -0.8vw, -4px);
`;

const Role = styled.p`
  max-width: 34ch;
  margin-top: clamp(26px, 4.5vh, 56px);
  font-size: clamp(17px, 1.5vw, 24px);
  line-height: 1.45;
  color: var(--ink-soft);

  em {
    font-size: 1.12em;
    color: var(--ink);
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: clamp(26px, 4.5vh, 56px);
  padding-top: 16px;
  border-top: 1px solid var(--hairline);
  color: var(--ink-soft);

  @media ${layout.down.sm} {
    flex-wrap: wrap;

    span:first-child {
      display: none;
    }
  }
`;

const Availability = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
`;

const Pulse = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 2.4s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.55);
      opacity: 0.55;
    }
  }
`;

const ScrollCue = styled.span`
  @media ${layout.down.md} {
    display: none;
  }
`;
