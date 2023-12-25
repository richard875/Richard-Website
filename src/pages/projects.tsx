import React from "react";
import gsap from "gsap";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import ScrollTrigger from "gsap/ScrollTrigger";
import { WindowLocation } from "@reach/router";
import Color from "../enums/color";
import layout from "../styles/layout";
import Route from "../routes/route";
import routeTo from "../routes/routeTo";
import MyProjects from "../types/myProjects";
import MousePosition from "../types/mousePosition";
import useWindowSize from "../hooks/useWindowSize";
import usePwaDetection from "../hooks/usePwaDetection";
import useDarkModeManager from "../hooks/useDarkModeManager";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import Block from "../components/projects/block";
import MetaTags from "../components/seo/metaTags";
import CallToAction from "../components/global/callToAction";
import InitialTransition from "../components/transition/InitialTransition";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../constants/margin";
import { PROJECTS_TITLE, COPYRIGHT, PAGE_TITLE } from "../constants/meta";
import projectsData from "../../static/data/projects.json";
import MetaImage from "../../static/images/meta/metaImage.jpg";

gsap.registerPlugin(ScrollTrigger);

const CURRENT_PAGE_TITLE = `${PROJECTS_TITLE}${PAGE_TITLE}`;

const Projects = ({ location }: { location: WindowLocation }) => {
  const slider = React.useRef<HTMLDivElement>(null);
  const component = React.useRef<HTMLDivElement>(null);

  // Hooks
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const windowWidth = useWindowSize().width;
  const isDarkMode = useDarkModeManager(false);
  const [hover, setHover] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_BLACK
  );

  React.useEffect(() => {
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
    <Container
      ref={component}
      $isDarkMode={isDarkMode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={transitionColor} />
      <Horizontal ref={slider} $entryLength={projectsData.length}>
        {projectsData.map((project: MyProjects, index: number) => (
          <Block
            key={index}
            index={index}
            project={project}
            setHover={setHover}
            isDarkMode={isDarkMode}
            dataLength={projectsData.length}
          />
        ))}
        <Bottom
          className="font-secondary-normal"
          $isDarkMode={isDarkMode}
          $isIphoneXPwa={isIphoneX && isPwa}
        >
          <p className="my-2">{COPYRIGHT}</p>
        </Bottom>
      </Horizontal>
      <Top $isDarkMode={isDarkMode}>
        <Title className="font-secondary-normal">{PROJECTS_TITLE}</Title>
        <div className="flex items-center">
          <div
            className="hidden sm:block"
            onClick={() =>
              setTransitionColor(
                isDarkMode
                  ? Color.BACKGROUND_BLACK
                  : Color.BACKGROUND_WHITE_SECONDARY
              )
            }
          >
            <CallToAction
              name="Back"
              forward={false}
              setHover={setHover}
              route={Route.Experience}
              isDarkMode={isDarkMode}
            />
          </div>
          <span className="hidden sm:block">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Cta
            className="font-secondary-normal underline underline-offset-2"
            $isDarkMode={isDarkMode}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
              setTransitionColor(
                isDarkMode
                  ? Color.BACKGROUND_BLACK
                  : Color.BACKGROUND_WHITE_SECONDARY
              );
              routeTo(e, Route.Education, isDarkMode);
            }}
          >
            Education
          </Cta>
          <span>&nbsp;&nbsp;</span>
          <div onClick={() => setTransitionColor(Color.BACKGROUND_BLACK)}>
            <CallToAction
              name="Contact"
              forward={true}
              setHover={setHover}
              route={Route.Contact}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </Top>
      <Cursor
        delay={0.5}
        hover={hover}
        isBlack={!isDarkMode}
        position={location.state! as MousePosition}
      />
    </Container>
  );
};

export default Projects;

export const Head: HeadFC = () => (
  <Splash>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta
      name="theme-color"
      content={Color.BACKGROUND_BLACK}
      media="(prefers-color-scheme: dark)"
    />
    <meta
      name="theme-color"
      content={Color.BACKGROUND_WHITE_SECONDARY}
      media="(prefers-color-scheme: light)"
    />
    <Preload />
    <MetaTags
      path={Route.Projects}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)<{ $isDarkMode: boolean }>`
  cursor: none;
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BACKGROUND_BLACK : Color.BACKGROUND_WHITE_SECONDARY};
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.WHITE : Color.BLACK)};

  @media ${layout.up.md} {
    overflow-x: hidden;
  }
`;

const Top = styled.div<{ $isDarkMode: boolean }>`
  position: fixed;
  top: 0;
  padding-top: 5px;
  padding-bottom: 3px;
  margin-left: ${BLOCK_PADDING + "px"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  border-bottom: ${({ $isDarkMode }) =>
    $isDarkMode
      ? `0.5px solid ${Color.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${Color.BACKGROUND_BLACK}`};
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BACKGROUND_BLACK : Color.BACKGROUND_WHITE_SECONDARY};

  @media ${layout.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    width: calc(100% - ${BLOCK_PADDING_DESKTOP * 2 + "px"});
  }
`;

const Title = styled.h1`
  font-size: 20px;
  user-select: none;

  @media ${layout.up.md} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div<{ $entryLength: number }>`
  flex-wrap: wrap;
  padding-top: 40px;

  @media ${layout.up.md} {
    display: flex;
    padding-top: 66px;
    padding-bottom: 20px;
    height: 100vh;
    width: ${({ $entryLength }) => `${$entryLength * BLOCK_WIDTH}px`};
  }

  @media ${layout.up.xxxl} {
    width: ${({ $entryLength }) => `${$entryLength * BLOCK_WIDTH_DESKTOP}px`};
  }
`;

const Bottom = styled.div<{
  $isDarkMode: boolean;
  $isIphoneXPwa: boolean;
}>`
  margin-top: 15px;
  margin-bottom: ${({ $isIphoneXPwa }) => ($isIphoneXPwa ? "15px" : "2px")};
  margin-left: ${BLOCK_PADDING + "px"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  border-top: ${({ $isDarkMode }) =>
    $isDarkMode
      ? `0.5px solid ${Color.BORDER_WHITE}`
      : `0.5px solid ${Color.BORDER_BLACK}`};

  @media ${layout.up.md} {
    display: none;
  }
`;

const Cta = styled.h2<{ $isDarkMode: boolean }>`
  display: flex;
  user-select: none;
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN};
`;
