import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import ScrollTrigger from "gsap/ScrollTrigger";
import Star from "./star";

// `01 — Selected Work` grammar: micro-label + hairline that draws itself in
// as the section enters the viewport.
const SectionLabel = ({
  index,
  title,
  dark = false,
}: {
  index: string;
  title: string;
  dark?: boolean;
}) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".label-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 88%", once: true },
      });
      gsap.from(".label-text", {
        autoAlpha: 0,
        y: 12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 88%", once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Root ref={rootRef} $dark={dark}>
      <Text className="font-label label-text">
        <span>{index}</span>
        <Star size={11} color="var(--gold)" />
        <span>{title}</span>
      </Text>
      <Rule className="label-rule" $dark={dark} />
    </Root>
  );
};

export default SectionLabel;

const Root = styled.div<{ $dark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: ${({ $dark }) => ($dark ? "var(--paper)" : "var(--ink)")};
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
`;

const Rule = styled.div<{ $dark: boolean }>`
  height: 1px;
  width: 100%;
  background: ${({ $dark }) =>
    $dark ? "var(--hairline-paper)" : "var(--hairline)"};
`;
