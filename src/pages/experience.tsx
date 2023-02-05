import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps, navigate } from "gatsby";
import styled from "styled-components";
import Route from "../routes/route";
import { isDesktop } from "react-device-detect";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { NAME } from "../constants/meta";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import Logos from "../components/experience/logos";
import SydneyOperaHouse from "../components/experience/sydneyOperaHouse";
import MousePosition from "../types/mousePosition";

const CallToAction = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const work = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE_SECONDARY;
    navigate(Route.Work, { state: { x: event.clientX, y: event.clientY } });
  };

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
      <div
        className="pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span onClick={(e) => work(e)}>Work Experience & Projects</span>
      </div>
      <FontAwesomeIcon icon={faCircleChevronRight} className="mt-0.5" />
    </Cta>
  );
};

const Experience = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const [hover, setHover] = React.useState(false);
  const [cursorColorIsBlack, setCursorColorIsBlack] = React.useState(false);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BLACK;
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
      <InitialTransition color={COLOR.BACKGROUND_WHITE_SECONDARY} />
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
          <span
            style={{ color: COLOR.USYD_ORANGE }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            University of Sydney
          </span>
          ,{" "}
          <span
            style={{ color: COLOR.AUSTRALIA_GOLD }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Australia
          </span>
          . On this corner of the internet, you'll find information about me.
          You can connect with me on{" "}
          <span
            className="underline underline-offset-4"
            style={{ color: COLOR.LINKEDIN_BLUE }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            LinkedIn
          </span>
          , check out my repositories on{" "}
          <span
            className="underline underline-offset-4"
            style={{ color: COLOR.BACKGROUND_WHITE }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            GitHub
          </span>
          , or reach out to me via{" "}
          <span
            className="underline underline-offset-4"
            style={{ color: COLOR.BLUE }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            email
          </span>
          . I hope you find my page enjoyable and have a great day!
        </LeftText>
        {useBreakpoint(down("sm")) && <CallToAction setHover={setHover} />}
        <Logos />
        {useBreakpoint(up("sm")) && <CallToAction setHover={setHover} />}
      </Left>
      <Right
        onMouseEnter={() => setCursorColorIsBlack(true)}
        onMouseLeave={() => setCursorColorIsBlack(false)}
        className="select-none"
      >
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
            Sydney Opera House
          </span>
        </SydneyOperaHouseInfoText>
      </Right>
      {isDesktop && !cursorColorIsBlack && (
        <Cursor
          hover={hover}
          delay={0.5}
          position={location.state!}
          isBlack={false}
        />
      )}
    </Container>
  );
};

export default Experience;

export const Head: HeadFC = () => <title>G'day | {NAME}</title>;

const Container = styled(motion.div)`
  background-color: ${COLOR.BLACK};
  cursor: none;

  ${up("lg")} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Left = styled.div`
  padding: 30px;
  background-color: ${COLOR.BACKGROUND_BLACK_SECONDARY};

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

const Right = styled.div`
  height: 500px;
  cursor: grab;
  background-color: ${COLOR.OFF_WHITE};

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
  font-size: 4.5vw;

  ${down("sm")} {
    margin-top: 8vw;
  }

  ${up("sm")} {
    font-size: 2vw;
  }

  ${up("lg")} {
    font-size: 1vw;
  }
`;
