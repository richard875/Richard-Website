import React from "react";
import type { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import Route from "../routes/route";
import routeTo from "../routes/routeTo";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "../enums/color";
import layout from "../styles/layout";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import MetaTags from "../components/seo/metaTags";
import Logos from "../components/experience/logos";
import SydneyOperaHouse from "../components/experience/sydneyOperaHouse";
import InitialTransition from "../components/transition/InitialTransition";
import setOverflow from "../helper/setOverflow";
import useDarkModeManager from "../hooks/useDarkModeManager";
import { INTRO_TITLE, PAGE_TITLE } from "../constants/meta";
import { EMAIL, LINKEDIN_URL, GITHUB_URL } from "../constants/meta";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const CURRENT_PAGE_TITLE = `${INTRO_TITLE}${PAGE_TITLE}`;
const AUSTRALIA = "https://www.youtube.com/watch?v=rMdbVHPmCW0";

const CallToAction = ({
  isDarkMode,
  setTransitionColor,
}: {
  isDarkMode: boolean;
  setTransitionColor: (color: Color) => void;
}) => (
  <Cta
    className="font-secondary-normal"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
  >
    <div className="cursor-pointer pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4 select-none">
      <span
        onClick={(e) => {
          setTransitionColor(
            isDarkMode
              ? Color.BACKGROUND_BLACK
              : Color.BACKGROUND_WHITE_SECONDARY
          );
          routeTo(e, Route.Experience, false, isDarkMode);
        }}
      >
        Work Experience & Projects
      </span>
    </div>
    <FontAwesomeIcon icon={faCircleChevronRight} className="mt-0.5" />
  </Cta>
);

const Experience = () => {
  const isDarkMode = useDarkModeManager(true, Color.BACKGROUND_BLACK);
  const [transitionColor, setTransitionColor] = React.useState(
    isDarkMode ? Color.BACKGROUND_BLACK : Color.BACKGROUND_WHITE_SECONDARY
  );

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.5 }}
    >
      <InitialTransition color={transitionColor} />
      <Left>
        <div className="hidden sm:flex w-full items-center justify-between sm:mb-[4vw] lg:mb-[2vw]">
          <Cta
            className="font-secondary-normal !text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} className="mt-0.5" />
            <div className="cursor-pointer text-base pl-2 hover:pl-3 transition-all ease-in-out underline underline-offset-4 select-none">
              <span
                onClick={(e) => {
                  setTransitionColor(Color.BACKGROUND_WHITE);
                  routeTo(e, Route.Home, true, true, Color.BACKGROUND_WHITE);
                }}
              >
                Home
              </span>
            </div>
          </Cta>
        </div>
        <LeftText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
        >
          G'day, I'm Richard. I'm a Software Engineer and Creative Designer from
          <Sydney>&nbsp;Sydney</Sydney>,
          <Australia
            onClick={(e) => {
              e.preventDefault();
              window.open(AUSTRALIA, "_blank");
            }}
          >
            &nbsp;Australia
          </Australia>
          . On this corner of the internet, you'll find information about me.
          You can connect with me on&nbsp;
          <LinkedIn>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </LinkedIn>
          , check out my repositories on&nbsp;
          <Github>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Github>
          , or reach out to me via&nbsp;
          <Email>
            <a
              href={`mailto:${EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              email
            </a>
          </Email>
          . I hope you find my page enjoyable and have a great day!
        </LeftText>
        <div className="sm:hidden">
          <CallToAction
            isDarkMode={isDarkMode}
            setTransitionColor={setTransitionColor}
          />
        </div>
        <Logos />
        <div className="hidden sm:flex w-full items-center justify-end">
          <CallToAction
            isDarkMode={isDarkMode}
            setTransitionColor={setTransitionColor}
          />
        </div>
      </Left>
      <Right
        onTouchStart={(e) => setOverflow(e, true)}
        onTouchEnd={(e) => setOverflow(e, false)}
      >
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.4 }}
        >
          <SydneyOperaHouse />
        </motion.div>
        <SydneyOperaHouseInfoText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.4 }}
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

const LeftText = styled(motion.div)`
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

const HoverableTextUnderline = styled(HoverableText)`
  padding-bottom: 8px;
  text-underline-offset: 4px;
  text-decoration-line: underline;
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
  display: flex;
  align-items: center;
  font-size: 19px;
  color: ${Color.BRIGHT_GREEN};

  @media ${layout.down.sm} {
    margin-top: 8vw;
  }
`;
