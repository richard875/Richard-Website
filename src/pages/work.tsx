import * as React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import Route from "../routes/route";
import projects from "../routes/projects";
import styled from "styled-components";
import { PAGE_TITLE } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import useWindowSize from "../hooks/useWindowSize";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import Layout from "../components/global/layout";
import LoadableCursorSsr from "../components/cursor/loadableCursorSsr";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/global/callToAction";
import Block from "../components/work/block";
import MousePosition from "../types/mousePosition";
import workData from "../../static/data/work.json";
import smh from "../../static/videos/smh.mp4";
import cie from "../../static/videos/cie.mp4";
import WorkExperience from "../types/workExperience";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../constants/workPage";
import MetaImage from "../../static/images/meta/metaImage.jpg";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Work Experience";
const CURRENT_PAGE_TITLE = `${TITLE}${PAGE_TITLE}`;

const Work = ({ location }: { location: GatsbyLinkProps<MousePosition> }) => {
  const windowWidth = useWindowSize().width;
  const slider = React.useRef<HTMLDivElement>(null);
  const component = React.useRef<HTMLDivElement>(null);

  const [hover, setHover] = React.useState(false);
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
            isDarkMode
              ? COLOR.BACKGROUND_BLACK
              : COLOR.BACKGROUND_WHITE_SECONDARY
          }
        />
        <Horizontal ref={slider} entryLength={workData.length}>
          {workData.map((experience: WorkExperience, index: number) => {
            return (
              <Block
                key={index}
                experience={experience}
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
            name="Projects"
            setHover={setHover}
            isDarkMode={isDarkMode}
            navigator={projects}
          />
        </Top>
        <LoadableCursorSsr
          hover={hover}
          delay={1.5}
          position={location.state!}
          isBlack={!isDarkMode}
          fallback={<></>}
        />
      </Container>
    </Layout>
  );
};

export default Work;

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
    <link rel="preload" href={smh} as="video" type="video/mp4" />
    <link rel="preload" href={cie} as="video" type="video/mp4" />
    <MetaTags
      path={Route.Work}
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
