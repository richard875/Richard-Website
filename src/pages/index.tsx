import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import mousePositionType from "../types/mousePositionType";
import gsapAnimationIndex from "../helper/gsapAnimationIndex";
import MOUSE_POSITION from "../constants/defaultmousePosition";
import Top from "../components/index/top";
import Bottom from "../components/index/bottom";
import FooterLeft from "../components/index/footerLeft";

const IndexPage = ({
  location,
}: {
  location: GatsbyLinkProps<mousePositionType>;
}) => {
  const timeRef = React.useRef(null);

  const [hover, setHover] = React.useState(false);
  const [globalCoords, setGlobalCoords] = React.useState(MOUSE_POSITION);

  React.useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) =>
      setGlobalCoords({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, []);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(timeRef.current, gsapAnimationIndex(150, 3.4, 20));
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
      exit={{ opacity: 0 }}
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
      <Cursor hover={hover} position={location.state!} isBlack={true} />
      <Wrapper>
        <Top setHover={setHover} />
        <Bottom setHover={setHover} />
      </Wrapper>
      <Footer>
        <FooterLeft setHover={setHover} globalCoords={globalCoords} />
        <FRight ref={timeRef}>
          <Indicator></Indicator>
          <div>Sydney 9:41 am</div>
        </FRight>
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

const FRight = styled.div`
  display: flex;
  align-items: center;
  padding-right: 98px;
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 7px;
  border-radius: 99px;
  background: #35be27;
`;
