import React from "react";
import gsap from "gsap";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import Color from "../enums/color";
import layout from "../styles/layout";
import Route from "../routes/route";
import routeTo from "../routes/routeTo";
import MousePosition from "../types/mousePosition";
import { SITE_TITLE } from "../constants/meta";
import { INDEX_TO_ACKNOWLEDGEMENT_IPHONEXPWA } from "../constants/googleTags";
import usePwaDetection from "../hooks/usePwaDetection";
import useDarkModeManager from "../hooks/useDarkModeManager";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import useLandscapeDetection from "../hooks/useLandscapeDetection";
import gsapAnimationIndex from "../helper/gsapAnimationIndex";
import Top from "../components/index/top";
import Splash from "../components/seo/splash";
import Bottom from "../components/index/bottom";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import Loading from "../components/index/loading";
import MetaTags from "../components/seo/metaTags";
import Landscape from "../components/global/landscape";
import SplitText from "../components/motion/splitText";
import FooterLeft from "../components/index/footerLeft";
import FooterRight from "../components/index/footerRight";
import InitialTransition from "../components/transition/initialTransition";
import MetaImage from "../../static/images/meta/meta-image.jpg";

const ENTRANCE_DELAY = 0.9;

const IndexPage = ({ location }: { location: WindowLocation }) => {
  // Hooks and Refs
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const isDarkMode = useDarkModeManager(false);
  const isLandscape = useLandscapeDetection(isPwa);
  const acknowledgementRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_BLACK,
  );

  // Layout effect: must land before paint, or the page briefly shows
  // whatever colour InitialTransition's exit-mask state defaulted to
  // (black) instead of this page's actual white background.
  React.useLayoutEffect(() => {
    if (!isLandscape) {
      document.body.style.backgroundColor = Color.BACKGROUND_WHITE;

      const themeTag = document.querySelector('meta[name="theme-color"]');
      if (themeTag) themeTag.setAttribute("content", Color.BACKGROUND_WHITE);
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLandscape]);

  // GSAP Animation
  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(acknowledgementRef.current, {
      duration: 1,
      ...gsapAnimationIndex(150, 1, 20),
    });
  }, []);

  return (
    <>
      <Container
        initial={{
          opacity: 0,
          transform: "scaleX(2) scaleY(2) translateY(-47px)",
        }}
        animate={{
          opacity: 1,
          transform: "scaleX(1) scaleY(1) translateY(0px)",
        }}
        transition={{
          opacity: { duration: 0.5 },
          transform: { type: "spring", stiffness: 65, delay: 0.2 },
        }}
      >
        <InitialTransition color={transitionColor} />
        <Box $isIphoneXPwa={isIphoneX && isPwa}>
          <Wrapper>
            <Top setHover={setHover} />
            <Bottom
              setHover={setHover}
              isDarkMode={isDarkMode}
              isIphoneXPwa={isIphoneX && isPwa}
              setTransitionColor={setTransitionColor}
            />
          </Wrapper>
          <div
            ref={acknowledgementRef}
            id={`${INDEX_TO_ACKNOWLEDGEMENT_IPHONEXPWA}_0`}
            className="sm:hidden"
            onClick={() => setTransitionColor(Color.BACKGROUND_BLACK)}
          >
            {isIphoneX && isPwa && (
              <h2
                id={`${INDEX_TO_ACKNOWLEDGEMENT_IPHONEXPWA}_1`}
                className="font-secondary-normal mt-2 ml-1 select-none"
                onClick={(e) => routeTo(e, Route.Acknowledgement)}
              >
                <SplitText as="span" delay={ENTRANCE_DELAY + 0.7}>
                  Acknowledgement of Country
                </SplitText>
              </h2>
            )}
          </div>
          <Footer>
            <FooterLeft
              setHover={setHover}
              setTransitionColor={setTransitionColor}
            />
            <FooterRight />
          </Footer>
        </Box>
        <Cursor
          hover={hover}
          delay={0.8}
          isBlack={true}
          isIndexPage={true}
          position={location.state! as MousePosition}
        />
      </Container>
      <Loading />
      {isLandscape && <Landscape isPwa={isPwa} />}
    </>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <Splash>
    <title>{SITE_TITLE}</title>
    <meta name="theme-color" content={Color.BACKGROUND_WHITE} />
    <Preload />
    <MetaTags path={Route.Home} MetaImage={MetaImage} name={SITE_TITLE} />
  </Splash>
);

const Container = styled(motion.div)`
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  background-color: ${Color.BACKGROUND_WHITE};
  cursor: none;

  @media ${layout.up.sm} {
    align-items: center;
  }
`;

const Box = styled.div<{ $isIphoneXPwa: boolean }>`
  width: calc(100vw - 30px);
  height: calc(100dvh - 85px);
  height: ${({ $isIphoneXPwa }) =>
    `calc(100dvh - ${($isIphoneXPwa ? 85 : 30) + "px"})`};

  @media ${layout.down.sm} {
    margin-top: 15px;
  }

  @media ${layout.up.sm} {
    width: calc(100vw - 70px);
    height: calc(100dvh - 70px);
  }

  @media ${layout.up.lg} {
    width: calc(100vw - 135px);
    height: calc(100dvh - 120px);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid ${Color.BLACK};
`;

const Footer = styled.div`
  width: 100%;
  height: 60px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  @media ${layout.down.lg} {
    display: none;
  }
`;
