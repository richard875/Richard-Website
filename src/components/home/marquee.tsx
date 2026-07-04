import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import ScrollTrigger from "gsap/ScrollTrigger";
import Star from "./star";

const PHRASES = [
  "Richard Everley",
  "Software Engineer",
  "Creative Technologist",
  "Sydney, Australia",
];

// The "fold" of the broadsheet — an infinite wordmark strip whose speed
// reacts to scroll velocity.
const Marquee = () => {
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 34,
      ease: "none",
      repeat: -1,
    });

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3.2);
        gsap.to(tween, {
          timeScale: boost,
          duration: 0.35,
          overwrite: true,
          onComplete: () =>
            void gsap.to(tween, { timeScale: 1, duration: 1.2 }),
        });
      },
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <Strip aria-hidden="true">
      <Track ref={trackRef}>
        {[0, 1].map((half) => (
          <Group key={half}>
            {PHRASES.map((phrase) => (
              <React.Fragment key={phrase}>
                <span className="font-display">{phrase}</span>
                <Star size={15} color="var(--gold)" />
              </React.Fragment>
            ))}
          </Group>
        ))}
      </Track>
    </Strip>
  );
};

export default Marquee;

const Strip = styled.div`
  overflow: hidden;
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  background: var(--paper);
  color: var(--ink);
  padding: 15px 0;
  user-select: none;
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  will-change: transform;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
  padding-right: 34px;

  span {
    font-size: clamp(15px, 1.45vw, 22px);
    white-space: nowrap;
    letter-spacing: 0.02em;
  }
`;
