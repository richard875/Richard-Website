import * as React from "react";
import { GatsbyLinkProps } from "gatsby";
import { motion } from "framer-motion";
import experience from "../routes/experience";
import acknowledgement from "../routes/acknowledgement";
import styled from "styled-components";
import { NAME } from "../constants/meta";
import { up } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import Loading from "../components/index/loading";
import InitialTransition from "../components/transition/InitialTransition";
import MousePosition from "../types/mousePosition";
import Top from "../components/index/top";
import Bottom from "../components/index/bottom";
import FooterLeft from "../components/index/footerLeft";
import FooterRight from "../components/index/footerRight";

const IndexPage = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
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
        <InitialTransition color={COLOR.BACKGROUND_BLACK} />
        <Box>
          <Header></Header>
          <Wrapper>
            <Top setHover={setHover} />
            <Bottom
              setHover={setHover}
              acknowledgement={acknowledgement}
              experience={experience}
            />
          </Wrapper>
          <Footer>
            {useBreakpoint(up("lg")) && (
              <>
                <FooterLeft
                  setHover={setHover}
                  acknowledgement={acknowledgement}
                />
                <FooterRight />
              </>
            )}
          </Footer>
        </Box>
        {isDesktop && (
          <Cursor
            hover={hover}
            delay={2.5}
            position={location.state!}
            isBlack={true}
            isIndexPage={true}
          />
        )}
      </Container>
      <Loading />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <title>{NAME} | Software Engineer | University of Sydney</title>
);

const Container = styled(motion.div)`
  width: 100vw;
  background-color: ${COLOR.BACKGROUND_WHITE};
  cursor: none;
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
