import * as React from "react";
import { motion } from "framer-motion";
import Route from "../routes/route";
import work from "../routes/work";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { NAME } from "../constants/meta";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import InitialTransition from "../components/transition/InitialTransition";
import Logos from "../components/experience/logos";
import SydneyOperaHouse from "../components/experience/sydneyOperaHouse";
import { EMAIL } from "../constants/meta";

const AUSTRALIA = "https://www.youtube.com/watch?v=rMdbVHPmCW0";
const LINKEDIN = "https://www.linkedin.com/in/richard875/";
const GITHUB = "https://github.com/richard875";
const SYDNEY_OPERA_HOUSE = "https://www.sydneyoperahouse.com/";

const CallToAction = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Cta
      className="font-secondary-normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        stiffness: 0,
        duration: 1,
        delay: 2,
      }}
    >
      <div className="cursor-pointer pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4">
        <span onClick={(e) => work(e, isDarkMode)}>
          Work Experience & Projects
        </span>
      </div>
      <FontAwesomeIcon icon={faCircleChevronRight} className="mt-0.5" />
    </Cta>
  );
};

const Experience = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

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
      transition={{
        stiffness: 0,
        duration: 1,
        delay: 0.5,
      }}
    >
      <InitialTransition
        color={
          isDarkMode ? COLOR.BACKGROUND_BLACK : COLOR.BACKGROUND_WHITE_SECONDARY
        }
      />
      <Left>
        <LeftText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 1,
            delay: 1,
          }}
        >
          G'day, I'm Richard. I'm a postgraduate student at the{" "}
          <Usyd>University of Sydney</Usyd>,{" "}
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
        {useBreakpoint(down("sm")) && <CallToAction isDarkMode={isDarkMode} />}
        <Logos />
        {useBreakpoint(up("sm")) && <CallToAction isDarkMode={isDarkMode} />}
      </Left>
      <Right className="select-none">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 1,
            delay: 2.5,
          }}
        >
          <SydneyOperaHouse />
        </motion.div>

        <SydneyOperaHouseInfoText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 1,
            delay: 2.5,
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
    <title>G'day | {NAME}</title>
    <meta name="theme-color" content={COLOR.BACKGROUND_BLACK} />
    <MetaTags path={Route.Experience} />
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

const Usyd = styled.span`
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
