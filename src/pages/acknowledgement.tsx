import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps, navigate } from "gatsby";
import styled from "styled-components";
import Route from "../routes/route";
import { NAME } from "../../static/data/meta";
import { up } from "styled-breakpoints";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import mousePositionType from "../types/mousePositionType";
import MOUSE_POSITION from "../constants/defaultmousePosition";

const Acknowledgement = ({
  location,
}: {
  location: GatsbyLinkProps<mousePositionType>;
}) => {
  const [hover, setHover] = React.useState(false);
  const [globalCoords, setGlobalCoords] = React.useState(MOUSE_POSITION);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
    const handleWindowMouseMove = (event: MouseEvent) =>
      setGlobalCoords({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleWindowMouseMove);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  const home = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    navigate(Route.Home, { state: globalCoords });
  };

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
      <AcknowledgementText
        className="font-primary-normal"
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
        Strait Islander Elders of all communities who also work and live on this
        land.
      </AcknowledgementText>
      <BackButton
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 1,
        }}
        className="font-primary-normal font-bold"
        onClick={(e) => home(e)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Back
      </BackButton>
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
  height: 100vh;
  padding: 10vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${COLOR.WHITE};
  background-color: ${COLOR.BLACK};
  cursor: none;
  user-select: none;
`;

const AcknowledgementText = styled(motion.div)`
  font-size: 20px;
  line-height: 35px;
  text-align: justify;

  ${up("md")} {
    font-size: 30px;
    line-height: 60px;
  }
`;

const BackButton = styled(motion.div)`
  font-size: 20px;
  margin-top: 70px;
  text-decoration-line: underline;
  text-underline-offset: 4px;
`;
