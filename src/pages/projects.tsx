import React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import Route from "../routes/route";
import education from "../routes/education";
import styled from "styled-components";
import { COPYRIGHT, PAGE_TITLE, MODE, STANDALONE } from "../constants/meta";
import useWindowSize from "../hooks/useWindowSize";
import type { HeadFC } from "gatsby";
import size from "../styles/layout";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import Preload from "../components/seo/preload";
import LoadableCursorSsr from "../components/cursor/loadableCursorSsr";
import InitialTransition from "../components/transition/InitialTransition";
import Block from "../components/projects/block";
import MousePosition from "../types/mousePosition";
import projectsData from "../../static/data/projects.json";
import MyProjects from "../types/myProjects";
import contact from "../routes/contact";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../constants/margin";
import MetaImage from "../../static/images/meta/metaImage.jpg";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Projects";
const CURRENT_PAGE_TITLE = `${TITLE}${PAGE_TITLE}`;

const Projects = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const windowWidth = useWindowSize().width;
  const slider = React.useRef<HTMLDivElement>(null);
  const component = React.useRef<HTMLDivElement>(null);

  // Hooks
  const [hover, setHover] = React.useState(false);
  const [toContact, setToContact] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isIphoneX, setIsIphoneX] = React.useState(false);

  // Detect if the page is opened as a PWA
  const params = new URLSearchParams((location as any).search);
  const isPwa = params.get(MODE) === STANDALONE;

  // Detect if the page is opened on an iPhone X or newer
  React.useEffect(() => {
    let iPhone =
      /iPhone/.test(navigator.userAgent) && !(window as any).MSStream;
    let aspect = window.screen.width / window.screen.height;
    setIsIphoneX(iPhone && aspect.toFixed(3) === "0.462");
  }, []);

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
      isDarkMode={isDarkMode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition
        color={
          isDarkMode || toContact
            ? COLOR.BACKGROUND_BLACK
            : COLOR.BACKGROUND_WHITE_SECONDARY
        }
      />
      <Horizontal ref={slider} entryLength={projectsData.length}>
        {projectsData.map((project: MyProjects, index: number) => {
          return (
            <Block
              key={index}
              project={project}
              dataLength={projectsData.length}
              index={index}
              setHover={setHover}
              isDarkMode={isDarkMode}
            />
          );
        })}
        <Bottom
          className="font-secondary-normal"
          isDarkMode={isDarkMode}
          isIphoneXPwa={isIphoneX && isPwa}
        >
          <p className="my-2">{COPYRIGHT}</p>
        </Bottom>
      </Horizontal>
      <Top isDarkMode={isDarkMode}>
        <Title className="font-secondary-normal">{TITLE}</Title>
        <CallToAction className="font-secondary-normal" isDarkMode={isDarkMode}>
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
            &nbsp;<span className="hidden md:inline-block">&nbsp;</span>
            <span className="md:hidden">|</span>
            <span className="hidden md:inline-block">&nbsp;</span>&nbsp;
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
      <LoadableCursorSsr
        hover={hover}
        delay={0.5}
        position={location.state!}
        isBlack={!isDarkMode}
        fallback={<></>}
      />
    </Container>
  );
};

export default Projects;

export const Head: HeadFC = () => (
  <>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta
      name="theme-color"
      content={COLOR.BACKGROUND_BLACK}
      media="(prefers-color-scheme: dark)"
    />
    <meta
      name="theme-color"
      content={COLOR.BACKGROUND_WHITE_SECONDARY}
      media="(prefers-color-scheme: light)"
    />
    <Preload />
    <MetaTags
      path={Route.Projects}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </>
);

const Container = styled(motion.div)`
  cursor: none;
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.WHITE : COLOR.BLACK};

  @media ${size.up.md} {
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
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 3px;
  border-bottom: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};

  @media ${size.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    width: calc(100% - ${BLOCK_PADDING_DESKTOP * 2 + "px"});
  }
`;

const Title = styled.p`
  font-size: 20px;
  user-select: none;

  @media ${size.up.md} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div`
  flex-wrap: wrap;
  padding-top: 40px;

  @media ${size.up.md} {
    padding-top: 66px;
    padding-bottom: 20px;
    width: ${({ entryLength }: { entryLength: number }) =>
      `${entryLength * BLOCK_WIDTH}px`};
    height: 100vh;
    display: flex;
  }

  @media ${size.up.xxxl} {
    width: ${({ entryLength }: { entryLength: number }) =>
      `${entryLength * BLOCK_WIDTH_DESKTOP}px`};
  }
`;

const Bottom = styled.div`
  margin-top: 15px;
  margin-bottom: ${({
    isDarkMode,
    isIphoneXPwa,
  }: {
    isDarkMode: boolean;
    isIphoneXPwa: boolean;
  }) => (isIphoneXPwa ? "15px" : "2px")};
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BORDER_WHITE}`
      : `0.5px solid ${COLOR.BORDER_BLACK}`};

  @media ${size.up.md} {
    display: none;
  }
`;

const CallToAction = styled.div`
  display: flex;
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BRIGHT_GREEN : COLOR.DIM_GREEN};
  user-select: none;
`;
