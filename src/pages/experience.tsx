import React from "react";
import gsap from "gsap";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import ScrollTrigger from "gsap/ScrollTrigger";
import Color from "../enums/color";
import Route from "../routes/route";
import layout from "../styles/layout";
import Block from "../components/work/block";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import MetaTags from "../components/seo/metaTags";
import SkillsBlock from "../components/work/skillsBlock";
import NavCluster from "../components/global/navCluster";
import InitialTransition from "../components/transition/initialTransition";
import MousePosition from "../types/mousePosition";
import WorkExperience from "../types/workExperience";
import useWindowSize from "../hooks/useWindowSize";
import usePwaDetection from "../hooks/usePwaDetection";
import useDarkModeManager from "../hooks/useDarkModeManager";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import getTransitionColor from "../helper/getTransitionColor";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../constants/margin";
import {
  EXPERIENCE_TO_INTRO,
  EXPERIENCE_TO_PROJECTS,
} from "../constants/googleTags";
import { EXPERIENCE_TITLE, COPYRIGHT, PAGE_TITLE } from "../constants/meta";
import workData from "../../static/data/work.json";
import MetaImage from "../../static/images/meta/metaImage.jpg";
import ToProjectsCircle from "../../static/images/NavCircle/toProjectsCircle.png";

gsap.registerPlugin(ScrollTrigger);

const CURRENT_PAGE_TITLE = `${EXPERIENCE_TITLE}${PAGE_TITLE}`;

const Work = ({ location }: { location: WindowLocation }) => {
  const slider = React.useRef<HTMLDivElement>(null);
  const component = React.useRef<HTMLDivElement>(null);

  // Hooks
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const windowWidth = useWindowSize().width;
  const isDarkMode = useDarkModeManager(false);
  const [hover, setHover] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_BLACK,
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
      <Horizontal ref={slider} $entryLength={workData.length + 1}>
        <SkillsBlock isDarkMode={isDarkMode} />
        {(workData as WorkExperience[]).map(
          (experience: WorkExperience, index: number) => (
            <Block
              key={index}
              index={index}
              setHover={setHover}
              experience={experience}
              isDarkMode={isDarkMode}
              dataLength={workData.length}
            />
          ),
        )}
        <Bottom
          className="font-secondary-normal"
          $isDarkMode={isDarkMode}
          $isIphoneXPwa={isIphoneX && isPwa}
        >
          <p className="my-2">{COPYRIGHT}</p>
        </Bottom>
      </Horizontal>
      <Top $isDarkMode={isDarkMode}>
        <Title className="font-secondary-normal">{EXPERIENCE_TITLE}</Title>
      </Top>
      <NavCluster
        isDarkMode={isDarkMode}
        setHover={setHover}
        delay={0.6}
        backRoute={Route.Intro}
        backTagId={EXPERIENCE_TO_INTRO}
        forwardRoute={Route.Projects}
        forwardTagId={EXPERIENCE_TO_PROJECTS}
        forwardImage={ToProjectsCircle}
        forwardAlt="To Projects Page"
        onForwardClick={() =>
          setTransitionColor(getTransitionColor(isDarkMode))
        }
      />
      <Cursor
        delay={0.5}
        hover={hover}
        isBlack={!isDarkMode}
        position={location.state! as MousePosition}
      />
    </Container>
  );
};

export default Work;

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
    <Preload videos="experience" />
    <MetaTags
      path={Route.Experience}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)<{ $isDarkMode: boolean }>`
  cursor: none;
  background-color: ${({ $isDarkMode }) =>
    `${getTransitionColor($isDarkMode)}`};
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.WHITE : Color.BLACK)};

  @media ${layout.up.md} {
    overflow-x: hidden;
  }
`;

const Top = styled.div<{ $isDarkMode: boolean }>`
  position: fixed;
  top: 0;
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 3px;
  border-bottom: ${({ $isDarkMode }) =>
    `0.5px solid ${getTransitionColor(!$isDarkMode)}`};
  background-color: ${({ $isDarkMode }) =>
    `${getTransitionColor($isDarkMode)}`};

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
    padding-top: 66px;
    padding-bottom: 20px;
    width: ${({ $entryLength }) => `${$entryLength * BLOCK_WIDTH}px`};
    height: 100vh;
    display: flex;
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
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${({ $isDarkMode }: { $isDarkMode: boolean }) =>
    $isDarkMode
      ? `0.5px solid ${Color.BORDER_WHITE}`
      : `0.5px solid ${Color.BORDER_BLACK}`};

  @media ${layout.up.md} {
    display: none;
  }
`;
