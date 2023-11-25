import * as React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import Route from "../routes/route";
import { COPYRIGHT, PAGE_TITLE } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import Layout from "../components/global/layout";
import LoadableCursorSsr from "../components/cursor/loadableCursorSsr";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/global/callToAction";
import Usyd from "../components/education/usyd";
import Uoa from "../components/education/uoa";
import MousePosition from "../types/mousePosition";
import contact from "../routes/contact";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/workPage";
import MetaImage from "../../static/images/meta/metaImage.jpg";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Education";
const CURRENT_PAGE_TITLE = `${TITLE}${PAGE_TITLE}`;

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
        transition={{ stiffness: 0, duration: 0.4 }}
      >
        <InitialTransition color={COLOR.BACKGROUND_BLACK} />
        <Top isDarkMode={isDarkMode}>
          <Title className="font-secondary-normal">{TITLE}</Title>
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
          {useBreakpoint(down("md")) && (
            <Bottom className="font-secondary-normal" isDarkMode={isDarkMode}>
              <p className="my-2">{COPYRIGHT}</p>
            </Bottom>
          )}
        </Horizontal>
        <LoadableCursorSsr
          hover={hover}
          delay={0.5}
          position={location.state!}
          isBlack={!isDarkMode}
          fallback={<></>}
        />
      </Container>
    </Layout>
  );
};

export default Education;

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
    <MetaTags
      path={Route.Education}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </>
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
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 3px;
  margin-left: ${BLOCK_PADDING + "px"};
  margin-right: ${BLOCK_PADDING + "px"};
  border-bottom: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};

  ${down("md")} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
    z-index: 9999;
  }

  ${up("md")} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.p`
  font-size: 20px;
  user-select: none;

  ${up("md")} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div`
  padding-top: 39px;

  ${up("md")} {
    display: flex;
    height: calc(100vh - 46.5px);
    padding-top: 19.5px;
    padding-bottom: 20px;
  }
`;

const Bottom = styled.div`
  margin-top: 15px;
  margin-bottom: 2px;
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.7px solid ${COLOR.BORDER_WHITE}`
      : `0.7px solid ${COLOR.BORDER_BLACK}`};
`;
