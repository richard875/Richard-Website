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
import MousePosition from "../types/mousePosition";
import usePwaDetection from "../hooks/usePwaDetection";
import useDarkModeManager from "../hooks/useDarkModeManager";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import Uoa from "../components/education/uoa";
import Splash from "../components/seo/splash";
import Usyd from "../components/education/usyd";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import MetaTags from "../components/seo/metaTags";
import CallToAction from "../components/global/callToAction";
import InitialTransition from "../components/transition/InitialTransition";
import {
  EDUCATION_TO_CONTACT,
  EDUCATION_TO_PROJECTS,
} from "../constants/googleTags";
import { EDUCATION_TITLE, COPYRIGHT, PAGE_TITLE } from "../constants/meta";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/margin";
import MetaImage from "../../static/images/meta/metaImage.jpg";

gsap.registerPlugin(ScrollTrigger);

const CURRENT_PAGE_TITLE = `${EDUCATION_TITLE}${PAGE_TITLE}`;

const Education = ({ location }: { location: WindowLocation }) => {
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const isDarkMode = useDarkModeManager(false);
  const [hover, setHover] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_BLACK
  );

  return (
    <Container
      $isDarkMode={isDarkMode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={transitionColor} />
      <Top $isDarkMode={isDarkMode}>
        <Title className="font-secondary-normal">{EDUCATION_TITLE}</Title>
        <div className="flex items-center">
          <div
            id={`${EDUCATION_TO_PROJECTS}_0`}
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
              tagId={EDUCATION_TO_PROJECTS}
              tagIdStartNum={1}
              forward={false}
              setHover={setHover}
              route={Route.Projects}
              isDarkMode={isDarkMode}
            />
          </div>
          <span className="hidden sm:block">&nbsp;&nbsp;</span>
          <CallToAction
            name="Contact"
            tagId={EDUCATION_TO_CONTACT}
            tagIdStartNum={0}
            forward={true}
            setHover={setHover}
            route={Route.Contact}
            isDarkMode={isDarkMode}
          />
        </div>
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
        delay={0.5}
        hover={hover}
        isBlack={!isDarkMode}
        position={location.state! as MousePosition}
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
    $isDarkMode ? Color.BACKGROUND_BLACK : Color.BACKGROUND_WHITE_SECONDARY};
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.WHITE : Color.BLACK)};
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
      ? `0.5px solid ${Color.BACKGROUND_WHITE_SECONDARY}`
      : `0.5px solid ${Color.BACKGROUND_BLACK}`};
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BACKGROUND_BLACK : Color.BACKGROUND_WHITE_SECONDARY};

  @media ${layout.down.md} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
    z-index: 99999 !important;
  }

  @media ${layout.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.h1`
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
      ? `0.7px solid ${Color.BORDER_WHITE}`
      : `0.7px solid ${Color.BORDER_BLACK}`};

  @media ${layout.up.md} {
    display: none;
  }
`;
