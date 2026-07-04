import React from "react";
import styled from "styled-components";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import useMaskReveal from "../../hooks/useMaskReveal";
import SectionLabel from "./sectionLabel";
import { INDEX_TO_INTRO } from "../../constants/googleTags";

const Statement = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const bigRef = React.useRef<HTMLParagraphElement>(null);
  useMaskReveal(bigRef, { start: "top 78%", stagger: 0.1 });

  return (
    <Section>
      <SectionLabel index="01" title="About" />
      <Big
        ref={bigRef}
        className="line-mask"
        style={{ visibility: "hidden" }}
      >
        I build digital products where engineering rigour meets
        <em className="font-accent"> design obsession </em>— menu boards in
        15,000 McDonald&rsquo;s restaurants, tools behind Australia&rsquo;s
        flag carrier, and web experiences for an award-winning agency.
      </Big>
      <Columns>
        <Col className="font-text">
          Currently Lead Software Engineer at Coates Group in Sydney —
          directing a team of five and the architecture behind
          McDonald&rsquo;s digital menu boards across the United States and
          Europe.
        </Col>
        <Col className="font-text">
          Before that: Qantas, SLIK — the agency that taught me taste — Health
          New Zealand, and startups on both sides of the Tasman. I care about
          the last two percent; the part people feel but can&rsquo;t name.
        </Col>
        <More
          id={`${INDEX_TO_INTRO}_1`}
          className="font-label"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => routeTo(e, Route.Intro)}
        >
          More about me <Arrow aria-hidden="true">→</Arrow>
        </More>
      </Columns>
    </Section>
  );
};

export default Statement;

const Section = styled.section`
  padding: clamp(80px, 14vh, 160px) var(--gutter) clamp(70px, 12vh, 140px);
  background: var(--paper);
  color: var(--ink);
`;

const Big = styled.p`
  font-family: "Archivo Variable", "Archivo", sans-serif;
  font-variation-settings: "wght" 640, "wdth" 103;
  font-size: clamp(27px, 4.35vw, 66px);
  line-height: 1.12;
  letter-spacing: -0.018em;
  margin-top: clamp(36px, 6vh, 72px);
  max-width: 21em;

  em {
    font-size: 1.05em;
    font-variation-settings: "wght" 400, "opsz" 90, "SOFT" 70, "WONK" 1;
  }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  margin-top: clamp(44px, 7vh, 88px);

  @media ${layout.up.md} {
    grid-template-columns: 5fr 5fr 2fr;
    gap: clamp(28px, 4vw, 64px);
    align-items: end;
  }
`;

const Col = styled.p`
  font-size: clamp(15px, 1.15vw, 18px);
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 42ch;
`;

const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const More = styled.button`
  background: none;
  border: none;
  padding: 0 0 6px;
  color: var(--ink);
  border-bottom: 1px solid var(--ink);
  width: fit-content;
  cursor: none;
  user-select: none;
  justify-self: start;

  @media ${layout.up.md} {
    justify-self: end;
  }

  &:hover ${Arrow} {
    transform: translateX(6px);
  }
`;
