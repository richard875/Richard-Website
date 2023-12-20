import React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import Route from "../routes/route";
import { COPYRIGHT, PAGE_TITLE, MODE, STANDALONE } from "../constants/meta";
import type { HeadFC } from "gatsby";
import layout from "../styles/layout";
import { COLOR } from "../styles/theme";
import Splash from "../components/seo/splash";
import MetaTags from "../components/seo/metaTags";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/global/callToAction";
import Usyd from "../components/education/usyd";
import Uoa from "../components/education/uoa";
import MousePosition from "../types/mousePosition";
import contact from "../routes/contact";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/margin";
import MetaImage from "../../static/images/meta/metaImage.jpg";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Education";
const CURRENT_PAGE_TITLE = `${TITLE}${PAGE_TITLE}`;

const Education = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  // Hooks
  const [hover, setHover] = React.useState(false);
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

  return (
    <Container
      $isDarkMode={isDarkMode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={COLOR.BACKGROUND_BLACK} />
      <Top $isDarkMode={isDarkMode}>
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
        <Bottom
          className="font-secondary-normal"
          $isDarkMode={isDarkMode}
          $isIphoneXPwa={isIphoneX && isPwa}
        >
          <p className="my-2">{COPYRIGHT}</p>
        </Bottom>
      </Horizontal>
      <Cursor
        hover={hover}
        delay={0.5}
        position={location.state!}
        isBlack={!isDarkMode}
      />
    </Container>
  );
};

export default Education;

export const Head: HeadFC = () => (
  <Splash>
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
      path={Route.Education}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)<{ $isDarkMode: boolean }>`
  cursor: none;
  height: 100vh;
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};
  color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.WHITE : COLOR.BLACK)};
`;

const Top = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 3px;
  margin-left: ${BLOCK_PADDING + "px"};
  margin-right: ${BLOCK_PADDING + "px"};
  border-bottom: ${({ $isDarkMode }) =>
    $isDarkMode
      ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY};

  @media ${layout.down.md} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
    z-index: 9999;
  }

  @media ${layout.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.p`
  font-size: 20px;
  user-select: none;

  @media ${layout.up.md} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div`
  padding-top: 39px;

  @media ${layout.up.md} {
    display: flex;
    height: calc(100vh - 46.5px);
    padding-top: 19.5px;
    padding-bottom: 20px;
  }
`;

const Bottom = styled.div<{
  $isDarkMode: boolean;
  $isIphoneXPwa: boolean;
}>`
  margin-top: 15px;
  padding-bottom: ${({ $isIphoneXPwa }) => ($isIphoneXPwa ? "15px" : "2px")};
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${({ $isDarkMode }: { $isDarkMode: boolean }) =>
    $isDarkMode
      ? `0.7px solid ${COLOR.BORDER_WHITE}`
      : `0.7px solid ${COLOR.BORDER_BLACK}`};

  @media ${layout.up.md} {
    display: none;
  }
`;
