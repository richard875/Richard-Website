import * as React from "react";
import gsap from "gsap";
import { GatsbyLinkProps } from "gatsby";
import { motion } from "framer-motion";
import Route from "../routes/route";
import intro from "../routes/intro";
import acknowledgement from "../routes/acknowledgement";
import styled from "styled-components";
import { SITE_TITLE, MODE, STANDALONE } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import gsapAnimationIndex from "../helper/gsapAnimationIndex";
import useWindowSize from "../hooks/useWindowSize";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Splash from "../components/seo/splash";
import MetaTags from "../components/seo/metaTags";
import Preload from "../components/seo/preload";
import Layout from "../components/global/layout";
import LoadableCursorSsr from "../components/cursor/loadableCursorSsr";
import Loading from "../components/index/loading";
import InitialTransition from "../components/transition/InitialTransition";
import Top from "../components/index/top";
import Bottom from "../components/index/bottom";
import FooterLeft from "../components/index/footerLeft";
import FooterRight from "../components/index/footerRight";
import MousePosition from "../types/mousePosition";
import MetaImage from "../../static/images/meta/metaImage.jpg";

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
    gsap.from(acknowledgementRef.current, 1, gsapAnimationIndex(150, 1, 20));
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
          opacity: { duration: 0.5 },
          transform: { type: "spring", stiffness: 65, delay: 0.2 },
        }}
      >
        <InitialTransition color={COLOR.BACKGROUND_BLACK} />
        <Box isIphoneXPwa={isIphoneX && isPwa}>
          <Wrapper>
            <Top setHover={setHover} />
            <Bottom
              setHover={setHover}
              acknowledgement={acknowledgement}
              intro={intro}
              isIphoneXPwa={isIphoneX && isPwa}
            />
          </Wrapper>
          <div ref={acknowledgementRef}>
            {useBreakpoint(down("sm")) && isIphoneX && isPwa && (
              <div
                className="font-secondary-normal mt-2 ml-1 select-none"
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
        <LoadableCursorSsr
          hover={hover}
          delay={0.5}
          position={location.state!}
          isBlack={true}
          isIndexPage={true}
          fallback={<></>}
        />
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
    <Preload />
    <MetaTags path={Route.Home} MetaImage={MetaImage} name={SITE_TITLE} />
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
