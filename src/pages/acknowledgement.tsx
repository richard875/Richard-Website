import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps, navigate } from "gatsby";
import styled from "styled-components";
import Route from "../routes/route";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
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
    const handleWindowMouseMove = (event: MouseEvent) =>
      setGlobalCoords({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, []);

  const home = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE;
    navigate(Route.Home, { state: globalCoords });
  };

  return (
    <Container
      className="select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        stiffness: 0,
        duration: 1,
        delay: 0.5,
      }}
    >
      <Cursor
        hover={hover}
        delay={1.5}
        position={location.state!}
        isBlack={false}
      />
      <AcknowledgementText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
        exit={{ opacity: 0 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 1,
        }}
        className="font-bold"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => home(e)}
      >
        Back
      </BackButton>
    </Container>
  );
};

export default Acknowledgement;

const Container = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  padding: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${COLOR.WHITE};
  background-color: ${COLOR.BLACK}; ;
`;

const AcknowledgementText = styled(motion.div)`
  font-size: 30px;
  line-height: 60px;
  text-align: justify;
`;

const BackButton = styled(motion.div)`
  font-size: 20px;
  margin-top: 70px;
  text-decoration-line: underline;
  text-underline-offset: 4px;
`;
