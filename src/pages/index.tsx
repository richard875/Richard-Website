import * as React from "react";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { isBrowser } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import Loading from "../components/index/loading";
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
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  return (
    <Layout>
      <Container
        initial={{
          opacity: 0,
          transform: "scaleX(2) scaleY(2) translateY(-47px)",
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
        {isBrowser && (
          <Cursor
            hover={hover}
            delay={2.5}
            position={location.state!}
            isBlack={true}
          />
        )}
        <InitialTransition color={COLOR.BACKGROUND_BLACK} />
        <Box>
          <Header></Header>
          <Wrapper>
            <Top setHover={setHover} />
            <Bottom setHover={setHover} />
          </Wrapper>
          <Footer>
            {useBreakpoint(up("lg")) && (
              <>
                <FooterLeft setHover={setHover} globalCoords={globalCoords} />
                <FooterRight />
              </>
            )}
          </Footer>
        </Box>
      </Container>
      <Loading />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <title>Richard Lee | Software Engineer | University of Sydney</title>
);

const Container = styled(motion.div)`
  width: 100vw;
  background-color: ${COLOR.BACKGROUND_WHITE};
`;

const Box = styled.div`
  width: calc(100vw - 30px);
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;

  ${up("sm")} {
    width: calc(100vw - 70px);
    margin-left: 35px;
    margin-right: 35px;
  }

  ${up("lg")} {
    width: calc(100vw - 140px);
    margin-left: 70px;
    margin-right: 70px;
  }
`;

const Header = styled.div`
  flex: 0.02;

  ${up("sm")} {
    flex: 0.05;
  }

  ${up("lg")} {
    flex: 0.07;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  flex: 0.845;
  border: 3px solid ${COLOR.BLACK};
  display: flex;
  flex-direction: column;

  ${up("sm")} {
    flex: 0.9;
  }

  ${up("lg")} {
    flex: 0.86;
  }
`;

const Footer = styled.div`
  width: 100%;
  flex: 0.05;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  ${up("lg")} {
    flex: 0.07;
  }
`;
