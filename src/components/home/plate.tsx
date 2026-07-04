import React from "react";
import gsap from "gsap";
import loadable from "@loadable/component";
import styled from "styled-components";
import ScrollTrigger from "gsap/ScrollTrigger";
import layout from "../../styles/layout";
import Star from "./star";

// Keep three.js and the GLTF pipeline out of the home page's initial
// bundle — the scene only loads once the reader approaches the plate.
const SydneyOperaHouse = loadable(
  () => import("../experience/sydneyOperaHouse")
);

// The Opera House diorama presented as a broadsheet figure plate:
// full-bleed, hairline-framed, captioned with coordinates and a drag hint.
const Plate = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const captionRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef(0.5);
  const [mounted, setMounted] = React.useState(false);
  const [active, setActive] = React.useState(true);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Mount the heavy scene one viewport early so it's ready on arrival
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom+=100%",
        once: true,
        onEnter: () => setMounted(true),
      });

      // Feed scroll progress to the camera dolly and pause the render
      // loop whenever the plate is fully off-screen
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
        onToggle: (self) => setActive(self.isActive),
      });

      gsap.from(captionRef.current, {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
        },
      });

      if (reduced) return;

      // The plate un-crops as it enters — a print image settling into
      // its frame
      gsap.fromTo(
        frameRef.current,
        { clipPath: "inset(5% 4% 5% 4%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 92%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef}>
      <Frame
        ref={frameRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {mounted && (
          <SydneyOperaHouse progressRef={progressRef} active={active} />
        )}
      </Frame>
      <Caption ref={captionRef} className="font-label">
        <span>
          Plate 01 <Star size={10} color="var(--gold)" /> Sydney Opera House —
          Bennelong Point
        </span>
        <Hint>Drag to spin — 33.8568° S, 151.2153° E</Hint>
      </Caption>
    </Section>
  );
};

export default Plate;

const Section = styled.section`
  background: var(--paper);
  color: var(--ink);
  padding-bottom: clamp(24px, 4vh, 44px);
`;

const Frame = styled.div`
  height: clamp(380px, 62vh, 640px);
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  overflow: hidden;
  cursor: none;

  @media ${layout.up.lg} {
    height: clamp(520px, 82vh, 880px);
  }

  & > div,
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const Caption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px var(--gutter) 0;
  color: var(--ink-soft);
  user-select: none;

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`;

const Hint = styled.span`
  @media ${layout.down.sm} {
    display: none;
  }
`;
