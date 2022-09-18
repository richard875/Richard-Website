import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import mousePositionType from "../types/mousePositionType";
import MOUSE_POSITION from "../constants/defaultmousePosition";
import Top from "../components/index/top";
import Bottom from "../components/index/bottom";
import FooterLeft from "../components/index/footerLeft";
import FooterRight from "../components/index/footerRight";

const IndexPage = ({
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

  return (
    <Container
      initial={{
        opacity: 0,
        transform: "scaleX(1.4) scaleY(1.75) translateY(-47px)",
      }}
      animate={{
        opacity: 1,
        transform: "scaleX(1) scaleY(1) translateY(0px)",
      }}
      transition={{
        opacity: {
          duration: 1,
        },
        transform: {
          type: "spring",
          stiffness: 65,
          delay: 1.5,
        },
      }}
    >
      <Cursor
        hover={hover}
        delay={2.5}
        position={location.state!}
        isBlack={true}
      />
      <InitialTransition color={COLOR.BACKGROUND_BLACK} />
      <Wrapper>
        <Top setHover={setHover} />
        <Bottom setHover={setHover} />
      </Wrapper>
      <Footer>
        <FooterLeft setHover={setHover} globalCoords={globalCoords} />
        <FooterRight />
      </Footer>
    </Container>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <title>Richard Lee | Software Engineer | University of Sydney</title>
);

const Container = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${COLOR.BACKGROUND_WHITE};
`;

const Wrapper = styled.div`
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 140px);
  height: calc(100vh - 140px);
  border: 3px solid ${COLOR.BLACK};
`;

const Footer = styled.div`
  width: 100%;
  height: 70px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
`;
