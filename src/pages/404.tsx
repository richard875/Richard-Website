import React from "react";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import Color from "../enums/color";
import Route from "../routes/route";
import layout from "../styles/layout";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import MetaTags from "../components/seo/metaTags";
import Landscape from "../components/global/landscape";
import CallToAction from "../components/global/callToAction";
import InitialTransition from "../components/transition/InitialTransition";
import MousePosition from "../types/mousePosition";
import MetaImage from "../../static/images/meta/metaImage.jpg";
import usePwaDetection from "../hooks/usePwaDetection";
import useLandscapeDetection from "../hooks/useLandscapeDetection";
import {
  PAGE_TITLE,
  NOT_FOUND_TITLE,
  DESCRIPTION_NOT_FOUND,
} from "../constants/meta";

const CURRENT_PAGE_TITLE = `${NOT_FOUND_TITLE}${PAGE_TITLE}`;

const NotFound = ({ location }: { location: WindowLocation }) => {
  const isPwa = usePwaDetection(location);
  const isLandscape = useLandscapeDetection(isPwa);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLandscape]);

  return isLandscape ? (
    <Landscape isPwa={isPwa} />
  ) : (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={Color.BACKGROUND_WHITE} />
      <Wrapper>
        <NotFoundText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4 }}
        >
          {DESCRIPTION_NOT_FOUND}
        </NotFoundText>
        <Cta
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
        >
          <CallToAction
            name="Home"
            forward={true}
            setHover={setHover}
            route={Route.Home}
            fromIntro={true}
          />
        </Cta>
      </Wrapper>
      <Cursor
        hover={hover}
        delay={0.3}
        position={location.state! as MousePosition}
        isBlack={false}
      />
    </Container>
  );
};

export default NotFound;

export const Head: HeadFC = () => (
  <Splash>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta name="theme-color" content={Color.BACKGROUND_BLACK} />
    <Preload />
    <MetaTags
      path={Route.NotFound}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Color.WHITE};
  background-color: ${Color.BACKGROUND_BLACK};
  cursor: none;
  user-select: none;
`;

const Wrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;

  @media ${layout.up.sm} {
    width: 70%;
  }
`;

const NotFoundText = styled(motion.p)`
  font-size: 6vw;
  line-height: 1.65;
  margin-bottom: 15px;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    font-size: 3vw;
    line-height: 1.8;
  }

  @media ${layout.up.lg} {
    font-size: 1.85vw;
  }
`;

const Cta = styled(motion.div)`
  display: flex;
  align-items: center;
  font-size: 19px;
  margin-top: 15px;
  margin-bottom: 100px;
  color: ${Color.BRIGHT_GREEN};
`;
