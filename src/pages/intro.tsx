import React from "react";
import type { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import Color from "../enums/color";
import layout from "../styles/layout";
import Route from "../routes/route";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import MetaTags from "../components/seo/metaTags";
import Logos from "../components/experience/logos";
import IntroBody from "../components/experience/introBody";
import PillCallToAction from "../components/global/pillCallToAction";
import RoundedCallToAction from "../components/global/roundedCallToAction";
import SydneyOperaHouse from "../components/soh/sydneyOperaHouse";
import InitialTransition from "../components/transition/initialTransition";
import setOverflow from "../helper/setOverflow";
import getTransitionColor from "../helper/getTransitionColor";
import useDarkModeManager from "../hooks/useDarkModeManager";
import {
  INTRO_SOH,
  INTRO_TO_INDEX,
  INTRO_TO_EXPERIENCE,
} from "../constants/googleTags";
import { PAGE_TITLE, INTRO_TITLE } from "../constants/meta";
import MetaImage from "../../static/images/meta/meta-image.jpg";

const CURRENT_PAGE_TITLE = `${INTRO_TITLE}${PAGE_TITLE}`;

// Entrance choreography: text reveals first, then the logos, then the
// back/forward nav buttons, then the Sydney Opera House scene — each stage
// starts as the previous one finishes. TEXT_DELAY + the SplitText's own
// reveal (~0.55s for the intro bio at its "split-fast" timing) lands just
// under LOGOS_DELAY; each later stage is spaced by STAGE_DURATION, the
// fade length the following stage animates over.
const TEXT_DELAY = 0.2;
const STAGE_DURATION = 0.3;
const LOGOS_DELAY = 0.75;
const NAV_DELAY = 1.05;
const SOH_DELAY = 1.35;

// The LinkedIn/GitHub/email underlines wait until every other entrance stage
// above has settled, then sweep in left-to-right — kept separate from the
// SplitText char reveal on purpose, since a per-character reveal and a fading
// underline fight each other visually if they run at once.
const UNDERLINE_DELAY = SOH_DELAY + STAGE_DURATION - 0.25;

const Experience = ({ location }: { location: WindowLocation }) => {
  const isDarkMode = useDarkModeManager(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_WHITE,
  );

  // Below the `lg` breakpoint this stacks into a normal vertical-scroll
  // page, so nothing else resets scroll between page mounts — without this,
  // arriving here keeps whatever scrollY the previous page left behind
  // instead of starting at the top.
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container
      $isDarkMode={isDarkMode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.5 }}
    >
      <InitialTransition color={transitionColor} />
      <Left>
        <div
          id={`${INTRO_TO_INDEX}_0`}
          className="flex w-full items-center justify-between mb-[4vw] lg:mb-[2vw]"
        >
          <Cta
            id={`${INTRO_TO_INDEX}_1`}
            className="font-secondary-normal text-base! mt-0!"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              stiffness: 0,
              duration: STAGE_DURATION,
              delay: NAV_DELAY,
            }}
          >
            <PillCallToAction
              name="Home"
              tagId={INTRO_TO_INDEX}
              tagIdStartNum={2}
              forward={false}
              setHover={() => {}}
              route={Route.Home}
              isDarkMode={isDarkMode}
              manualCursor={true}
            />
          </Cta>
        </div>
        <LeftText className="font-secondary-normal" $isDarkMode={isDarkMode}>
          <IntroBody
            delay={TEXT_DELAY}
            isDarkMode={isDarkMode}
            underlineDelay={UNDERLINE_DELAY}
          />
        </LeftText>
        <div className="hidden sm:block">
          <Logos delay={LOGOS_DELAY} isDarkMode={isDarkMode} />
        </div>
        <Cta
          id={`${INTRO_TO_EXPERIENCE}_0`}
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: STAGE_DURATION,
            delay: NAV_DELAY,
          }}
          onClick={() => setTransitionColor(getTransitionColor(isDarkMode))}
        >
          <RoundedCallToAction
            name="Work Experience & Projects"
            tagId={INTRO_TO_EXPERIENCE}
            tagIdStartNum={1}
            forward={true}
            setHover={() => {}}
            route={Route.Experience}
            isDarkMode={isDarkMode}
            manualCursor={true}
          />
        </Cta>
        <div className="sm:hidden">
          <Logos delay={LOGOS_DELAY} isDarkMode={isDarkMode} />
        </div>
      </Left>
      <Right
        id={`${INTRO_SOH}_0`}
        onTouchStart={(e) => setOverflow(e, true)}
        onTouchEnd={(e) => setOverflow(e, false)}
      >
        <motion.div
          id={`${INTRO_SOH}_1`}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: STAGE_DURATION,
            delay: SOH_DELAY,
          }}
        >
          <SydneyOperaHouse />
        </motion.div>
        <SydneyOperaHouseInfoText
          $isDarkMode={isDarkMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: STAGE_DURATION,
            delay: SOH_DELAY,
          }}
        >
          <span className="font-secondary-normal">Sydney Opera House</span>
        </SydneyOperaHouseInfoText>
      </Right>
    </Container>
  );
};

export default Experience;

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
      path={Route.Intro}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)<{ $isDarkMode: boolean }>`
  background-color: ${({ $isDarkMode }) => getTransitionColor($isDarkMode)};

  @media ${layout.up.lg} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Left = styled.div`
  padding: 30px;

  @media ${layout.down.sm} {
    padding-bottom: 10px;
  }

  @media ${layout.up.sm} {
    padding: 50px;
  }

  @media ${layout.up.lg} {
    width: 55vw;
    height: 100vh;
    padding: 6vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const LeftText = styled(motion.p)<{ $isDarkMode: boolean }>`
  font-size: 6vw;
  line-height: 1.65;
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.WHITE : Color.BLACK)};

  @media ${layout.up.sm} {
    font-size: 3vw;
    line-height: 1.8;
  }

  @media ${layout.up.lg} {
    font-size: 1.85vw;
    line-height: 1.8;
  }
`;

const Right = styled.div`
  height: 500px;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  @media ${layout.up.sm} {
    height: 60vh;
  }

  @media ${layout.up.lg} {
    width: 45vw;
    height: 100vh;
  }
`;

const SydneyOperaHouseInfoText = styled(motion.div)<{ $isDarkMode: boolean }>`
  left: 0;
  right: 0;
  bottom: 10%;
  font-size: 14px;
  position: relative;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.WHITE : Color.BLACK)};
`;

const Cta = styled(motion.div)`
  font-size: 19px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;

  @media ${layout.down.sm} {
    margin-top: 4vw;
  }
`;
