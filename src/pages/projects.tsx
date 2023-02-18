import * as React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import education from "../routes/education";
import styled from "styled-components";
import { NAME } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import useWindowSize from "../hooks/useWindowSize";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import Block from "../components/projects/block";
import SkillsBlock from "../components/projects/skillsBlock";
import MousePosition from "../types/mousePosition";
import projectsData from "../../static/data/projects.json";
import MyProjects from "../types/myProjects";
import contact from "../routes/contact";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../constants/workPage";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Skills and Projects";

const Projects = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const windowWidth = useWindowSize().width;
  const slider = React.useRef<HTMLDivElement>(null);
  const component = React.useRef<HTMLDivElement>(null);

  const [hover, setHover] = React.useState(false);
  const [toContact, setToContact] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const updateIsDarkMode = () =>
      setIsDarkMode(() => {
        const isDarkMode = mediaQueryList.matches;
        document.body.style.backgroundColor = isDarkMode
          ? COLOR.BACKGROUND_BLACK
          : COLOR.BACKGROUND_WHITE_SECONDARY;
        return isDarkMode;
      });

    mediaQueryList.addEventListener("change", updateIsDarkMode);
    updateIsDarkMode();

    return () => mediaQueryList.removeEventListener("change", updateIsDarkMode);
  }, []);

  React.useLayoutEffect(() => {
    if (!!windowWidth && windowWidth > 768) {
      let ctx = gsap.context(() => {
        gsap.to(slider.current, {
          xPercent: -100,
          left: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: slider.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + slider.current!.offsetWidth,
          },
        });
      }, component);
      return () => ctx.revert();
    }
  }, [windowWidth]);

  return (
    <Layout>
      <Container
        ref={component}
        isDarkMode={isDarkMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.5,
        }}
      >
        <InitialTransition
          color={
            isDarkMode || toContact
              ? COLOR.BACKGROUND_BLACK
              : COLOR.BACKGROUND_WHITE_SECONDARY
          }
        />
        <Horizontal ref={slider} entryLength={projectsData.length + 1}>
          <SkillsBlock isDarkMode={isDarkMode} />
          {projectsData.map((project: MyProjects, index: number) => {
            return (
              <Block
                key={index}
                project={project}
                index={index}
                setHover={setHover}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </Horizontal>
        <Top isDarkMode={isDarkMode}>
          <Title className="font-secondary-normal">
            {TITLE}&nbsp;&nbsp;&nbsp;&nbsp;
          </Title>
          <CallToAction
            className="font-secondary-normal"
            isDarkMode={isDarkMode}
          >
            <div
              className="underline underline-offset-2"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={(e) => {
                setToContact(false);
                education(e, isDarkMode);
              }}
            >
              Education
            </div>
            <span className="font-primary-normal pt-0.5 md:pt-0">
              &nbsp;{useBreakpoint(up("md")) && " "}
              {useBreakpoint(down("md")) && "|"}
              {useBreakpoint(up("md")) && " "}&nbsp;
            </span>
            <div
              className="underline underline-offset-2"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={(e) => {
                setToContact(true);
                contact(e);
              }}
            >
              Contact
            </div>
          </CallToAction>
        </Top>

        {isDesktop && (
          <Cursor
            hover={hover}
            delay={1.5}
            position={location.state!}
            isBlack={!isDarkMode}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Projects;

export const Head: HeadFC = () => (
  <title>
    {TITLE} | {NAME}
  </title>
);

const Container = styled(motion.div)`
  cursor: none;
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.WHITE : COLOR.BLACK};

  ${up("md")} {
    overflow-x: hidden;
  }
`;

const Top = styled.div`
  position: fixed;
  top: 0;
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 3px;
  border-bottom: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};

  ${down("md")} {
    justify-content: space-between;
  }

  ${up("md")} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    width: calc(100% - ${BLOCK_PADDING_DESKTOP * 2 + "px"});
  }
`;

const Title = styled.p`
  font-size: 20px;

  ${up("md")} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div`
  flex-wrap: wrap;
  padding-top: 40px;

  ${up("md")} {
    padding-top: 66px;
    padding-bottom: 20px;
    width: ${({ entryLength }: { entryLength: number }) =>
      `${entryLength * BLOCK_WIDTH}px`};
    height: 100vh;
    display: flex;
  }

  ${up("xxxl")} {
    width: ${({ entryLength }: { entryLength: number }) =>
      `${entryLength * BLOCK_WIDTH_DESKTOP}px`};
  }
`;

const CallToAction = styled.div`
  display: flex;
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BRIGHT_GREEN : COLOR.DIM_GREEN};
`;
