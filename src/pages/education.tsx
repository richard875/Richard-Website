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
import CallToAction from "../components/global/callToAction";
import Usyd from "../components/education/usyd";
import Uoa from "../components/education/uoa";
import MousePosition from "../types/mousePosition";
import contact from "../routes/contact";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/workPage";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Education";

const Education = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
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
        <InitialTransition color={COLOR.BACKGROUND_BLACK} />
        <Top isDarkMode={isDarkMode}>
          <Title className="font-secondary-normal">
            {TITLE}&nbsp;&nbsp;&nbsp;&nbsp;
          </Title>
          <CallToAction
            name="Contact"
            setHover={setHover}
            isDarkMode={isDarkMode}
            navigator={contact}
          />
        </Top>
        <Horizontal>
          <Usyd isDarkMode={isDarkMode} />
          <Uoa isDarkMode={isDarkMode} />
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
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};
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
  border-bottom: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};

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
    height: calc(100vh - 46.5px);
    padding-top: 19.5px;
    padding-bottom: 20px;
  }
`;
