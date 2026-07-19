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
import SplitText from "../components/motion/SplitText";
import HoverRoll from "../components/motion/HoverRoll";
import CallToAction from "../components/global/callToAction";
import RoundedCallToAction from "../components/global/roundedCallToAction";
import SydneyOperaHouse from "../components/experience/sydneyOperaHouse";
import InitialTransition from "../components/transition/InitialTransition";
import setOverflow from "../helper/setOverflow";
import useDarkModeManager from "../hooks/useDarkModeManager";
import {
  INTRO_SOH,
  INTRO_EMAIL,
  INTRO_GITHUB,
  INTRO_LINKEDIN,
  INTRO_AUSTRALIA,
  INTRO_TO_INDEX,
  INTRO_TO_EXPERIENCE,
} from "../constants/googleTags";
import {
  HTTPS,
  EMAIL,
  FIRST_NAME,
  PAGE_TITLE,
  INTRO_TITLE,
  GITHUB_URL,
  LINKEDIN_URL,
} from "../constants/meta";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const CURRENT_PAGE_TITLE = `${INTRO_TITLE}${PAGE_TITLE}`;
const AUSTRALIA = `${HTTPS}www.youtube.com/watch?v=rMdbVHPmCW0`;

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
const UNDERLINE_STAGGER = 0.05;

const Experience = ({ location }: { location: WindowLocation }) => {
  const isDarkMode = useDarkModeManager(true, Color.BACKGROUND_BLACK);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_WHITE,
  );

  // Memoised so its identity is stable across re-renders — SplitText splits
  // this into characters once and a parent re-render must not rebuild the
  // nodes underneath it.
  //
  // LinkedIn/GitHub/email are HoverRoll, not plain text: that adds the
  // hover-roll interaction to the very `.char` spans this single SplitText
  // produces for them, rather than giving them their own separate split and
  // reveal — see HoverRoll' own doc comment for how it grafts onto
  // SplitText's DOM instead of doing its own split.
  const introBody = React.useMemo(
    () => (
      <SplitText
        as="span"
        className="split-fast"
        delay={TEXT_DELAY}
        amount={0.1}
      >
        G'day, I'm {FIRST_NAME}. I'm a Software Engineer and Creative Designer
        from<Sydney>&nbsp;Sydney</Sydney>,
        <Australia
          id={`${INTRO_AUSTRALIA}_0`}
          onClick={(e) => {
            e.preventDefault();
            window.open(AUSTRALIA, "_blank");
          }}
        >
          &nbsp;Australia
        </Australia>
        . On this corner of the internet, you'll find information about me. You
        can connect with me on&nbsp;
        <LinkedIn id={`${INTRO_LINKEDIN}_0`}>
          <a
            id={`${INTRO_LINKEDIN}_1`}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverRoll stagger={0.014}>LinkedIn</HoverRoll>
          </a>
          <Underline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: UNDERLINE_DELAY,
            }}
          />
        </LinkedIn>
        , check out my repositories on&nbsp;
        <Github id={`${INTRO_GITHUB}_0`}>
          <a
            id={`${INTRO_GITHUB}_1`}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverRoll stagger={0.016}>GitHub</HoverRoll>
          </a>
          <Underline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: UNDERLINE_DELAY + UNDERLINE_STAGGER,
            }}
          />
        </Github>
        , or reach out to me via&nbsp;
        <Email id={`${INTRO_EMAIL}_0`}>
          <a
            id={`${INTRO_EMAIL}_1`}
            href={`mailto:${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverRoll>email</HoverRoll>
          </a>
          <Underline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: UNDERLINE_DELAY + UNDERLINE_STAGGER * 2,
            }}
          />
        </Email>
        . I hope you find my page enjoyable and have a great day!
      </SplitText>
    ),
    [],
  );

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.5 }}
    >
      <InitialTransition color={transitionColor} />
      <Left>
        <div
          id={`${INTRO_TO_INDEX}_0`}
          className="hidden sm:flex w-full items-center justify-between sm:mb-[4vw] lg:mb-[2vw]"
        >
          <Cta
            id={`${INTRO_TO_INDEX}_1`}
            className="font-secondary-normal !text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              stiffness: 0,
              duration: STAGE_DURATION,
              delay: NAV_DELAY,
            }}
          >
            <CallToAction
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
        <LeftText className="font-secondary-normal">{introBody}</LeftText>
        <div className="hidden sm:block">
          <Logos delay={LOGOS_DELAY} />
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
          onClick={() =>
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY,
            )
          }
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
          <Logos delay={LOGOS_DELAY} />
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
    <meta name="theme-color" content={Color.BACKGROUND_BLACK} />
    <Preload />
    <MetaTags
      path={Route.Intro}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)`
  @media ${layout.up.lg} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Left = styled.div`
  padding: 30px;
  background-color: ${Color.BACKGROUND_BLACK};

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

const LeftText = styled(motion.p)`
  font-size: 6vw;
  line-height: 1.65;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    font-size: 3vw;
    line-height: 1.8;
  }

  @media ${layout.up.lg} {
    font-size: 1.85vw;
    line-height: 1.8;
  }
`;

const HoverableText = styled.span`
  cursor: pointer;
`;

// position: relative + display: inline-block so the Underline bar below can
// position itself against this (unsplit) span rather than some distant
// ancestor. display: inline-block matters as much as position: relative
// here: an absolutely positioned child of a plain `inline` box has a
// browser-inconsistent containing block for `left`/`right`, so `left: 0;
// right: 0` resolves against the wrong width and the bar drifts off to one
// side. inline-block gives it a proper box to anchor to while still
// wrapping like a word within the surrounding text.
const HoverableTextUnderline = styled(HoverableText)`
  position: relative;
  display: inline-block;
`;

// A real text-decoration underline can't be used here: this text sits inside
// a per-character SplitText reveal, which wraps each char in its own
// `display: inline-block` span (splitting.css), and text-decoration can't
// paint through those — each char ends up drawing its own tiny underline
// segment instead of one continuous line. This bar sidesteps the problem by
// living outside the split text entirely: it's a separate, absolutely
// positioned element with its own `currentColor` background, so it always
// renders as one unbroken line regardless of what SplitText does to the text
// above it. Its opacity (not the bar itself) is what fades in via
// framer-motion, on the usages below.
const Underline = styled(motion.span)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.67vw;
  height: 3px;
  background-color: currentColor;
`;

const Sydney = styled.span`
  color: ${Color.SYDNEY_ORANGE};
`;

const Australia = styled(HoverableText)`
  cursor: pointer;
  color: ${Color.AUSTRALIA_GOLD};
`;

const LinkedIn = styled(HoverableTextUnderline)`
  color: ${Color.LINKEDIN_BLUE};
`;

const Github = styled(HoverableTextUnderline)`
  color: ${Color.BACKGROUND_WHITE};
`;

const Email = styled(HoverableTextUnderline)`
  color: ${Color.BLUE};
`;

const Right = styled.div`
  height: 500px;
  cursor: grab;
  user-select: none;
  background-color: ${Color.BACKGROUND_WHITE_SECONDARY};

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

const SydneyOperaHouseInfoText = styled(motion.div)`
  left: 0;
  right: 0;
  bottom: 10%;
  font-size: 14px;
  position: relative;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;

const Cta = styled(motion.div)`
  font-size: 19px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;

  @media ${layout.down.sm} {
    margin-top: 8vw;
    justify-content: flex-start;
  }
`;
