import * as React from "react";
import gsap from "gsap";
import { GatsbyLinkProps } from "gatsby";
import { motion } from "framer-motion";
import Route from "../routes/route";
import experience from "../routes/experience";
import acknowledgement from "../routes/acknowledgement";
import styled from "styled-components";
import { SITE_TITLE, MODE, STANDALONE } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import gsapAnimationIndex from "../helper/gsapAnimationIndex";
import useWindowSize from "../hooks/useWindowSize";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Splash from "../components/seo/splash";
import MetaTags from "../components/seo/metaTags";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import Loading from "../components/index/loading";
import InitialTransition from "../components/transition/InitialTransition";
import Top from "../components/index/top";
import Bottom from "../components/index/bottom";
import FooterLeft from "../components/index/footerLeft";
import FooterRight from "../components/index/footerRight";
import MousePosition from "../types/mousePosition";
import fontPrimaryNormal from "../../static/fonts/SansSerifFLF-Demibold.woff";
import fontPrimaryBold from "../../static/fonts/SansSerifBldFLF.woff";
import fontSecondaryNormal from "../../static/fonts/BwGradual-Medium.ttf";
import fontSecondaryBold from "../../static/fonts/sf-pro-medium.otf";
import MetaImage from "../../static/images/splash/apple-splash-2224-1668.jpg";

const IndexPage = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  // Refs
  const acknowledgementRef = React.useRef(null);

  // Hooks
  const [hover, setHover] = React.useState(false);
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
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // GSAP Animation
  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(
      acknowledgementRef.current,
      2.3,
      gsapAnimationIndex(150, 3.4, 20)
    );
  }, []);

  return (
    <Layout>
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
          opacity: {
            duration: 1,
          },
          transform: {
            type: "spring",
            stiffness: 65,
            delay: 1.5,
          },
        }}
      >
        <InitialTransition color={COLOR.BACKGROUND_BLACK} />
        <Box isIphoneXPwa={isIphoneX && isPwa}>
          <Wrapper>
            <Top setHover={setHover} />
            <Bottom
              setHover={setHover}
              acknowledgement={acknowledgement}
              experience={experience}
              isIphoneXPwa={isIphoneX && isPwa}
            />
          </Wrapper>
          <div ref={acknowledgementRef}>
            {useBreakpoint(down("sm")) && isIphoneX && isPwa && (
              <div
                className="font-secondary-normal mt-2 ml-1"
                onClick={(e) => acknowledgement(e)}
              >
                Acknowledgement of Country
              </div>
            )}
          </div>
          {useBreakpoint(up("lg")) && (
            <Footer>
              <FooterLeft
                setHover={setHover}
                acknowledgement={acknowledgement}
              />
              <FooterRight />
            </Footer>
          )}
        </Box>
        {isDesktop && (
          <Cursor
            hover={hover}
            delay={2.5}
            position={location.state!}
            isBlack={true}
            isIndexPage={true}
          />
        )}
      </Container>
      <Loading />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <Splash>
    <title>{SITE_TITLE}</title>
    <meta name="theme-color" content={COLOR.BACKGROUND_WHITE} />
    {/* Preload Fonts */}
    <link
      rel="preload"
      href={fontPrimaryNormal}
      as="font"
      type="font/woff"
      crossorigin="anonymous"
    />
    <link
      rel="preload"
      href={fontPrimaryBold}
      as="font"
      type="font/woff"
      crossorigin="anonymous"
    />
    <link
      rel="preload"
      href={fontSecondaryNormal}
      as="font"
      type="font/ttf"
      crossorigin="anonymous"
    />
    <link
      rel="preload"
      href={fontSecondaryBold}
      as="font"
      type="font/otf"
      crossorigin="anonymous"
    />
    <MetaTags path={Route.Home} MetaImage={MetaImage} />
  </Splash>
);

const Container = styled(motion.div)`
  width: 100vw;
  height: ${() => useWindowSize().height! + "px"};
  display: flex;
  justify-content: center;
  background-color: ${COLOR.BACKGROUND_WHITE};
  cursor: none;

  ${up("sm")} {
    align-items: center;
  }
`;

const Box = styled.div`
  width: calc(100vw - 30px);
  height: ${({ isIphoneXPwa }: { isIphoneXPwa: boolean }) =>
    useWindowSize().height! - (isIphoneXPwa ? 85 : 30) + "px"};

  ${down("sm")} {
    margin-top: 15px;
    position: relative;
  }

  ${up("sm")} {
    width: calc(100vw - 70px);
    height: ${() => useWindowSize().height! - 70 + "px"};
  }

  ${up("lg")} {
    width: calc(100vw - 135px);
    height: ${() => useWindowSize().height! - 120 + "px"};
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid ${COLOR.BLACK};
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  width: 100%;
  height: 60px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
`;
