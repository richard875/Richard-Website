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
import useWindowSize from "../hooks/useWindowSize";
import usePwaDetection from "../hooks/usePwaDetection";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import gsapAnimationIndex from "../helper/gsapAnimationIndex";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import Loading from "../components/index/loading";
import MetaTags from "../components/seo/metaTags";
import Top from "../components/index/top";
import Bottom from "../components/index/bottom";
import FooterLeft from "../components/index/footerLeft";
import FooterRight from "../components/index/footerRight";
import InitialTransition from "../components/transition/InitialTransition";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const IndexPage = ({ location }: { location: WindowLocation }) => {
  // Hooks and Refs
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const acknowledgementRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.body.style.backgroundColor = Color.BACKGROUND_WHITE;
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
        <InitialTransition color={Color.BACKGROUND_BLACK} />
        <Box $isIphoneXPwa={isIphoneX && isPwa}>
          <Wrapper>
            <Top setHover={setHover} />
            <Bottom setHover={setHover} isIphoneXPwa={isIphoneX && isPwa} />
          </Wrapper>
          <div ref={acknowledgementRef} className="sm:hidden">
            {isIphoneX && isPwa && (
              <h2
                className="font-secondary-normal mt-2 ml-1 select-none"
                onClick={(e) => routeTo(e, Route.Acknowledgement)}
              >
                Acknowledgement of Country
              </h2>
            )}
          </div>
          <Footer>
            <FooterLeft setHover={setHover} />
            <FooterRight />
          </Footer>
        </Box>
        <Cursor
          hover={hover}
          delay={0.5}
          isBlack={true}
          isIndexPage={true}
          position={location.state! as MousePosition}
        />
      </Container>
      <Loading />
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
  height: ${() => useWindowSize().height! + "px"};
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
  height: ${({ $isIphoneXPwa }) =>
    useWindowSize().height! - ($isIphoneXPwa ? 85 : 30) + "px"};

  @media ${layout.down.sm} {
    margin-top: 15px;
    position: relative;
  }

  @media ${layout.up.sm} {
    width: calc(100vw - 70px);
    height: ${() => useWindowSize().height! - 70 + "px"};
  }

  @media ${layout.up.lg} {
    width: calc(100vw - 135px);
    height: ${() => useWindowSize().height! - 120 + "px"};
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
