import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import ScrollTrigger from "gsap/ScrollTrigger";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import mediaPicker from "../../helper/mediaPicker";
import useIsDesktop from "../../hooks/useIsDesktop";
import MyProjects from "../../types/myProjects";
import SectionLabel from "./sectionLabel";
import projectsData from "../../../static/data/projects.json";

type WorkRow = {
  title: string;
  subtitle: string;
  media?: string;
};

const rows: WorkRow[] = (projectsData as MyProjects[]).map((project) => {
  const [title, ...rest] = project.name.split(" - ");
  return {
    title,
    subtitle: rest.join(" - "),
    media: project.media ? mediaPicker(project.media) : undefined,
  };
});

const WorkIndex = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isDesktop = useIsDesktop();
  const sectionRef = React.useRef<HTMLElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const quickX = React.useRef<((v: number) => void) | null>(null);
  const quickY = React.useRef<((v: number) => void) | null>(null);
  const [active, setActive] = React.useState<number | null>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".work-row", {
        autoAlpha: 0,
        y: 36,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 82%",
          once: true,
        },
      });

      // A wheel scroll can carry the section away without a mouseleave
      // firing — drop the preview once the section exits the viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => setActive(null),
        onLeaveBack: () => setActive(null),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-following preview with inertia — x trails slower than y on
  // purpose, which gives the frame its organic drift
  React.useEffect(() => {
    if (!previewRef.current) return;
    quickX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.4,
      ease: "power3.out",
    });
  }, [isDesktop]);

  const onMouseMove = (e: React.MouseEvent) => {
    quickX.current?.(e.clientX);
    quickY.current?.(e.clientY);
  };

  React.useEffect(() => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, {
      autoAlpha: active !== null && rows[active].media ? 1 : 0,
      scale: active !== null && rows[active].media ? 1 : 0.88,
      rotation: active !== null ? (active % 2 === 0 ? 2.5 : -2.5) : 0,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [active]);

  const activeMedia = active !== null ? rows[active].media : undefined;

  return (
    <Section id="work" ref={sectionRef} onMouseMove={onMouseMove}>
      <SectionLabel index="02" title="Selected Work" />
      <List ref={listRef} onMouseLeave={() => setActive(null)}>
        {rows.map((row, index) => (
          <Row
            key={row.title}
            className="work-row"
            onMouseEnter={() => {
              setActive(index);
              setHover(true);
            }}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => routeTo(e, Route.Projects)}
          >
            <Num className="font-label">
              {String(index + 1).padStart(2, "0")}
            </Num>
            <Title className="font-display">{row.title}</Title>
            <Subtitle className="font-text">{row.subtitle}</Subtitle>
            <RowArrow aria-hidden="true">→</RowArrow>
          </Row>
        ))}
      </List>
      <All
        className="font-label"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => routeTo(e, Route.Projects)}
      >
        All projects &amp; build notes <span aria-hidden="true">→</span>
      </All>
      {isDesktop && (
        <Preview ref={previewRef} aria-hidden="true">
          {rows.map(
            (row) =>
              row.media && (
                <PreviewVideo
                  key={row.title}
                  src={row.media}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  $visible={activeMedia === row.media}
                />
              )
          )}
        </Preview>
      )}
    </Section>
  );
};

export default WorkIndex;

const Section = styled.section`
  padding: clamp(70px, 12vh, 140px) var(--gutter);
  background: var(--paper);
  color: var(--ink);
  position: relative;
`;

const List = styled.div`
  margin-top: clamp(30px, 5vh, 60px);
`;

const Num = styled.span`
  color: var(--ink-soft);
  transition: color 0.3s ease;
  padding-top: 8px;
`;

const Title = styled.span`
  font-size: clamp(30px, 5.2vw, 78px);
  line-height: 0.95;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Subtitle = styled.span`
  font-size: clamp(13px, 1vw, 16px);
  line-height: 1.4;
  color: var(--ink-soft);
  max-width: 30ch;
  justify-self: end;
  text-align: right;

  @media ${layout.down.md} {
    justify-self: start;
    text-align: left;
    grid-column: 2;
  }
`;

const RowArrow = styled.span`
  font-size: clamp(22px, 2.2vw, 34px);
  opacity: 0;
  transform: translateX(-14px);
  transition: opacity 0.35s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 3.2em 1fr minmax(0, 30ch) 1.4em;
  align-items: baseline;
  gap: clamp(14px, 2vw, 34px);
  padding: clamp(20px, 3vh, 34px) 0;
  border-bottom: 1px solid var(--hairline);
  cursor: none;
  user-select: none;

  &:first-child {
    border-top: 1px solid var(--hairline);
  }

  &:hover ${Num} {
    color: var(--gold);
  }

  &:hover ${Title} {
    transform: translateX(clamp(8px, 1.2vw, 20px));
  }

  &:hover ${RowArrow} {
    opacity: 1;
    transform: translateX(0);
  }

  @media ${layout.down.md} {
    grid-template-columns: 3.2em 1fr;

    ${RowArrow} {
      display: none;
    }
  }
`;

const All = styled.button`
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

const Preview = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: clamp(240px, 24vw, 360px);
  height: clamp(300px, 30vw, 450px);
  margin-left: 26px;
  margin-top: -12%;
  pointer-events: none;
  z-index: 940;
  opacity: 0;
  overflow: hidden;
  background: var(--ink);
  outline: 1px solid var(--ink);
  visibility: hidden;
`;

const PreviewVideo = styled.video<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.25s ease;
`;
