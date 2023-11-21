import * as React from "react";
import { motion } from "framer-motion";
import Route from "../routes/route";
import home from "../routes/home";
import experience from "../routes/experience";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { PAGE_TITLE } from "../constants/meta";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import InitialTransition from "../components/transition/InitialTransition";
import Logos from "../components/experience/logos";
import SydneyOperaHouse from "../components/experience/sydneyOperaHouse";
import { EMAIL } from "../constants/meta";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const CURRENT_PAGE_TITLE = `G'day${PAGE_TITLE}`;
const AUSTRALIA = "https://www.youtube.com/watch?v=rMdbVHPmCW0";
const LINKEDIN = "https://www.linkedin.com/in/richard875/";
const GITHUB = "https://github.com/richard875";
const SYDNEY_OPERA_HOUSE = "https://www.sydneyoperahouse.com/";

const CallToAction = ({
  isDarkMode,
  setTransitionColor,
}: {
  isDarkMode: boolean;
  setTransitionColor: (color: string) => void;
}) => {
  return (
    <Cta
      className="font-secondary-normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        stiffness: 0,
        duration: 0.4,
        delay: 0.2,
      }}
    >
      <div className="cursor-pointer pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4">
        <span
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? COLOR.BACKGROUND_BLACK
                : COLOR.BACKGROUND_WHITE_SECONDARY
            );
            experience(e, isDarkMode);
          }}
        >
          Work Experience & Projects
        </span>
      </div>
      <FontAwesomeIcon icon={faCircleChevronRight} className="mt-0.5" />
    </Cta>
  );
};

const Experience = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY
  );

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const updateIsDarkMode = () => setIsDarkMode(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", updateIsDarkMode);
    updateIsDarkMode();

    return () => mediaQueryList.removeEventListener("change", updateIsDarkMode);
  }, []);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.5 }}
    >
      <InitialTransition color={transitionColor} />
      <Left>
        {useBreakpoint(up("sm")) && (
          <div className="w-full flex items-center justify-between sm:mb-[4vw] lg:mb-[2vw]">
            <Cta
              className="font-secondary-normal !text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
            >
              <FontAwesomeIcon icon={faCircleChevronLeft} className="mt-0.5" />
              <div className="cursor-pointer text-base pl-2 hover:pl-3 transition-all ease-in-out underline underline-offset-4">
                <span
                  onClick={(e) => {
                    setTransitionColor(COLOR.BACKGROUND_WHITE);
                    home(e);
                  }}
                >
                  Home
                </span>
              </div>
            </Cta>
          </div>
        )}
        <LeftText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 0.4,
            delay: 0.2,
          }}
        >
          G'day, I'm Richard. I'm a Software Engineer and Creative Designer from{" "}
          <Sydney>Sydney</Sydney>,{" "}
          <Australia
            onClick={(e) => {
              e.preventDefault();
              window.open(AUSTRALIA, "_blank");
            }}
          >
            Australia
          </Australia>
          . On this corner of the internet, you'll find information about me.
          You can connect with me on&nbsp;
          <LinkedIn>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </LinkedIn>
          , check out my repositories on&nbsp;
          <Github>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
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
        {useBreakpoint(down("sm")) && (
          <CallToAction
            isDarkMode={isDarkMode}
            setTransitionColor={setTransitionColor}
          />
        )}
        <Logos />
        {useBreakpoint(up("sm")) && (
          <div className="w-full flex items-center justify-end">
            <CallToAction
              isDarkMode={isDarkMode}
              setTransitionColor={setTransitionColor}
            />
          </div>
        )}
      </Left>
      <Right className="select-none">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 0.4,
            delay: 0.4,
          }}
        >
          <SydneyOperaHouse />
        </motion.div>

        <SydneyOperaHouseInfoText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 0.4,
            delay: 0.4,
          }}
        >
          <span className="font-secondary-normal cursor-pointer">
            <a
              href={SYDNEY_OPERA_HOUSE}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sydney Opera House
            </a>
          </span>
        </SydneyOperaHouseInfoText>
      </Right>
    </Container>
  );
};

export default Experience;

export const Head: HeadFC = () => (
  <>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta name="theme-color" content={COLOR.BACKGROUND_BLACK} />
    <MetaTags
      path={Route.Intro}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </>
);

const Container = styled(motion.div)`
  ${up("lg")} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Left = styled.div`
  padding: 30px;
  background-color: ${COLOR.BACKGROUND_BLACK};

  ${down("sm")} {
    padding-bottom: 10px;
  }

  ${up("sm")} {
    padding: 50px;
  }

  ${up("lg")} {
    width: 55vw;
    height: 100vh;
    padding: 6vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const LeftText = styled(motion.div)`
  color: ${COLOR.WHITE};
  font-size: 6vw;
  line-height: 1.65;

  ${up("sm")} {
    font-size: 3vw;
    line-height: 1.8;
  }

  ${up("lg")} {
    font-size: 1.85vw;
    line-height: 1.8;
  }
`;

const HoverableText = styled.span`
  cursor: pointer;
`;

const HoverableTextUnderline = styled(HoverableText)`
  padding-bottom: 8px;
  text-decoration-line: underline;
  text-underline-offset: 4px;
`;

const Sydney = styled.span`
  color: ${COLOR.USYD_ORANGE};
`;

const Australia = styled(HoverableText)`
  color: ${COLOR.AUSTRALIA_GOLD};
  cursor: pointer;
`;

const LinkedIn = styled(HoverableTextUnderline)`
  color: ${COLOR.LINKEDIN_BLUE};
`;

const Github = styled(HoverableTextUnderline)`
  color: ${COLOR.BACKGROUND_WHITE};
`;

const Email = styled(HoverableTextUnderline)`
  color: ${COLOR.BLUE};
`;

const Right = styled.div`
  height: 500px;
  cursor: grab;
  background-color: ${COLOR.BACKGROUND_WHITE_SECONDARY};

  &:active {
    cursor: grabbing;
  }

  ${up("sm")} {
    height: 60vh;
  }

  ${up("lg")} {
    width: 45vw;
    height: 100vh;
  }
`;

const SydneyOperaHouseInfoText = styled(motion.div)`
  font-size: 14px;
  position: relative;
  bottom: 10%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
`;

const Cta = styled(motion.div)`
  display: flex;
  align-items: center;
  color: ${COLOR.BRIGHT_GREEN};
  font-size: 19px;

  ${down("sm")} {
    margin-top: 8vw;
  }
`;
