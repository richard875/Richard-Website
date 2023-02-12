import * as React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import { NAME } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/education/callToAction";
import Block from "../components/education/block";
import MousePosition from "../types/mousePosition";
import workData from "../../static/data/work.json";
import WorkExperience from "../types/workExperience";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/workPage";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Education";

const Education = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const topRef = React.useRef<HTMLDivElement>(null);

  const [hover, setHover] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [bg, setBg] = React.useState(COLOR.BACKGROUND_WHITE_SECONDARY);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const updateIsDarkMode = () =>
      setIsDarkMode(() => {
        const isDarkMode = mediaQueryList.matches;
        document.body.style.backgroundColor = isDarkMode
          ? COLOR.BACKGROUND_BLACK_SECONDARY
          : COLOR.BACKGROUND_WHITE_SECONDARY;
        return isDarkMode;
      });

    mediaQueryList.addEventListener("change", updateIsDarkMode);
    updateIsDarkMode();

    return () => mediaQueryList.removeEventListener("change", updateIsDarkMode);
  }, []);

  React.useEffect(() => {
    setBg(
      isDarkMode
        ? COLOR.BACKGROUND_BLACK_SECONDARY
        : COLOR.BACKGROUND_WHITE_SECONDARY
    );
  }, [isDarkMode]);

  return (
    <Layout>
      <Container
        isDarkMode={isDarkMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.5,
        }}
      >
        <InitialTransition color={bg} />
        <Top ref={topRef} isDarkMode={isDarkMode} backgroundColor={bg}>
          <Title className="font-secondary-normal">
            {TITLE}&nbsp;&nbsp;&nbsp;&nbsp;
          </Title>
          <CallToAction setHover={setHover} isDarkMode={isDarkMode} />
        </Top>

        <Horizontal top={topRef.current?.getBoundingClientRect().height!}>
          {workData
            .slice(0, 2)
            .map((experience: WorkExperience, index: number) => {
              return (
                <Block
                  key={index}
                  index={index}
                  setHover={setHover}
                  isDarkMode={isDarkMode}
                />
              );
            })}
        </Horizontal>

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

export default Education;

export const Head: HeadFC = () => (
  <title>
    {TITLE} | {NAME}
  </title>
);

const Container = styled(motion.div)`
  cursor: none;
  height: 100vh;
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? COLOR.BACKGROUND_BLACK_SECONDARY
      : COLOR.BACKGROUND_WHITE_SECONDARY};
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.WHITE : COLOR.BLACK};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 3px;
  margin-left: ${BLOCK_PADDING + "px"};
  margin-right: ${BLOCK_PADDING + "px"};
  border-bottom: ${({
    isDarkMode,
    backgroundColor,
  }: {
    isDarkMode: boolean;
    backgroundColor: string;
  }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${COLOR.BACKGROUND_BLACK_SECONDARY}`};

  ${down("md")} {
    justify-content: space-between;
  }

  ${up("md")} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.p`
  font-size: 20px;

  ${up("md")} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div`
  ${up("md")} {
    display: flex;
    height: 100%;
    height: ${({ top }: { top: number }) => `calc(100vh - ${top + "px"})`};
    padding-top: 19.5px;
    padding-bottom: 20px;
  }
`;
