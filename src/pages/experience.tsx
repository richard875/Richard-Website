import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { isDesktop } from "react-device-detect";
import { NAME } from "../../static/data/meta";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import Logos from "../components/experience/logos";
import mousePositionType from "../types/mousePositionType";
import MOUSE_POSITION from "../constants/defaultmousePosition";

const CallToAction = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Cta
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4">
        Work Experience & Projects
      </div>
      <FontAwesomeIcon
        icon={faCircleChevronRight}
        size={"md"}
        className="mt-0.5"
      />
    </Cta>
  );
};

const Experience = ({
  location,
}: {
  location: GatsbyLinkProps<mousePositionType>;
}) => {
  const [hover, setHover] = React.useState(false);
  const [cursorColorIsBlack, setCursorColorIsBlack] = React.useState(true);
  const [globalCoords, setGlobalCoords] = React.useState(MOUSE_POSITION);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
    const handleWindowMouseMove = (event: MouseEvent) => {
      setCursorColorIsBlack(event.clientX / window.innerWidth > 0.55);
      setGlobalCoords({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
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
      {isDesktop && (
        <Cursor
          hover={hover}
          delay={1.5}
          position={location.state!}
          isBlack={cursorColorIsBlack}
        />
      )}
      <InitialTransition color={COLOR.BACKGROUND_WHITE} />
      <Left>
        <LeftText className="font-secondary-normal">
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
        {useBreakpoint(down("sm")) && (
          <CallToAction hover={hover} setHover={setHover} />
        )}
        <Logos />
        {useBreakpoint(up("sm")) && (
          <CallToAction hover={hover} setHover={setHover} />
        )}
      </Left>
      <Right></Right>
    </Container>
  );
};

export default Experience;

export const Head: HeadFC = () => <title>G'day | {NAME}</title>;

const Container = styled(motion.div)`
  background-color: ${COLOR.BACKGROUND_BLACK};

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

const LeftText = styled.div`
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
  ${up("lg")} {
    width: 45vw;
    height: 100vh;
    background-color: ${COLOR.OFF_WHITE};
  }
`;

const Cta = styled.div`
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
