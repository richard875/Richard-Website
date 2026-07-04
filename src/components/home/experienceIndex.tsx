import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import ScrollTrigger from "gsap/ScrollTrigger";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import WorkExperience from "../../types/workExperience";
import SectionLabel from "./sectionLabel";
import workData from "../../../static/data/work.json";

const experiences = workData as WorkExperience[];

const formatYears = (start: string, end: string) =>
  end.toLowerCase() === "current" ? `${start} — now` : `${start} — ${end}`;

const ExperienceIndex = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".exp-row", {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="experience" ref={sectionRef}>
      <SectionLabel index="03" title="Experience" />
      <Table>
        {experiences.map((experience) => (
          <Row
            key={`${experience.companyTitle}-${experience.start}`}
            className="exp-row"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => routeTo(e, Route.Experience)}
          >
            <Years className="font-label">
              {formatYears(experience.start, experience.end)}
            </Years>
            <Company className="font-display">
              {experience.companyTitle}
            </Company>
            <Role className="font-text">{experience.jobTitle}</Role>
            <City className="font-label">
              {experience.city}, {experience.country}
            </City>
          </Row>
        ))}
      </Table>
      <More
        className="font-label"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => routeTo(e, Route.Education)}
      >
        Education &amp; the full record <span aria-hidden="true">→</span>
      </More>
    </Section>
  );
};

export default ExperienceIndex;

const Section = styled.section`
  padding: clamp(70px, 12vh, 140px) var(--gutter) clamp(90px, 14vh, 170px);
  background: var(--paper);
  color: var(--ink);
`;

const Table = styled.div`
  margin-top: clamp(30px, 5vh, 60px);
  border-top: 1px solid var(--hairline);
`;

const Years = styled.span`
  color: var(--ink-soft);
  transition: color 0.25s ease;
`;

const Company = styled.span`
  font-size: clamp(20px, 2.1vw, 32px);
  line-height: 1.05;
`;

const Role = styled.span`
  font-size: clamp(14px, 1.05vw, 17px);
  color: var(--ink-soft);
  transition: color 0.25s ease;
`;

const City = styled.span`
  color: var(--ink-soft);
  text-align: right;
  transition: color 0.25s ease;

  @media ${layout.down.md} {
    display: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(7.5em, 12%) 1fr minmax(0, 34%) minmax(0, 18%);
  align-items: center;
  gap: clamp(12px, 2vw, 30px);
  padding: clamp(16px, 2.4vh, 24px) 10px;
  margin: 0 -10px;
  border-bottom: 1px solid var(--hairline);
  cursor: none;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background: var(--ink);
    color: var(--paper);

    ${Years}, ${Role}, ${City} {
      color: var(--paper);
    }
  }

  @media ${layout.down.md} {
    grid-template-columns: minmax(6.5em, auto) 1fr;

    ${Role} {
      grid-column: 2;
    }
  }
`;

const More = styled.button`
  background: none;
  border: none;
  color: var(--ink);
  margin-top: clamp(26px, 4vh, 44px);
  padding: 0 0 6px;
  border-bottom: 1px solid var(--ink);
  cursor: none;
  user-select: none;

  span {
    display: inline-block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover span {
    transform: translateX(6px);
  }
`;
