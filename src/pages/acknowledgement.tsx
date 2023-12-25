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
import CallToAction from "../components/global/callToAction";
import InitialTransition from "../components/transition/InitialTransition";
import MousePosition from "../types/mousePosition";
import MetaImage from "../../static/images/meta/metaImage.jpg";
import { ACKNOWLEDGEMENT_TITLE, PAGE_TITLE } from "../constants/meta";

const CURRENT_PAGE_TITLE = `${ACKNOWLEDGEMENT_TITLE}${PAGE_TITLE}`;

const Acknowledgement = ({ location }: { location: WindowLocation }) => {
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.body.style.backgroundColor = Color.BACKGROUND_BLACK;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={Color.BACKGROUND_WHITE} />
      <Wrapper>
        <AcknowledgementText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4 }}
        >
          We acknowledge the Traditional Owners of the land where we work and
          live. We pay our respects to Elders past, present and emerging. We
          celebrate the stories, culture and traditions of Aboriginal and Torres
          Strait Islander Elders of all communities who also work and live on
          this land.
        </AcknowledgementText>
        <Cta
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
        >
          <CallToAction
            name="Back"
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

export default Acknowledgement;

export const Head: HeadFC = () => (
  <Splash>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta name="theme-color" content={Color.BACKGROUND_BLACK} />
    <Preload />
    <MetaTags
      path={Route.Acknowledgement}
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

const AcknowledgementText = styled(motion.p)`
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
