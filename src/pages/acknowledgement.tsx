import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import home from "../routes/home";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { NAME } from "../constants/meta";
import { up } from "styled-breakpoints";
import useWindowSize from "../hooks/useWindowSize";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import MousePosition from "../types/mousePosition";

const Acknowledgement = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
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
      <InitialTransition color={COLOR.BACKGROUND_WHITE} />
      <Wrapper>
        <AcknowledgementText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            stiffness: 0,
            duration: 1,
          }}
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
          transition={{
            stiffness: 0,
            duration: 1,
            delay: 1,
          }}
        >
          <div className="pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4">
            <span
              onClick={(e) => home(e)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Back
            </span>
          </div>
          <FontAwesomeIcon icon={faCircleChevronRight} className="mt-0.5" />
        </Cta>
      </Wrapper>
      {isDesktop && (
        <Cursor
          hover={hover}
          delay={1.5}
          position={location.state!}
          isBlack={false}
        />
      )}
    </Container>
  );
};

export default Acknowledgement;

export const Head: HeadFC = () => <title>Acknowledgement | {NAME}</title>;

const Container = styled(motion.div)`
  width: 100vw;
  height: ${() => useWindowSize().height! + "px"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLOR.WHITE};
  background-color: ${COLOR.BACKGROUND_BLACK};
  cursor: none;
  user-select: none;
`;

const Wrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;

  ${up("sm")} {
    width: 70%;
  }
`;

const AcknowledgementText = styled(motion.div)`
  font-size: 6vw;
  line-height: 1.65;
  color: ${COLOR.WHITE};
  margin-bottom: 15px;

  ${up("sm")} {
    font-size: 3vw;
    line-height: 1.8;
  }

  ${up("lg")} {
    font-size: 1.85vw;
  }
`;

const Cta = styled(motion.div)`
  display: flex;
  align-items: center;
  color: ${COLOR.BRIGHT_GREEN};
  font-size: 19px;
  margin-top: 15px;

  ${up("sm")} {
    margin-bottom: 100px;
  }
`;
