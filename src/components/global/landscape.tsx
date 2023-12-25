import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Color from "../../enums/color";
import layout from "../../styles/layout";

const Landscape = ({ isPwa }: { isPwa: boolean }) => {
  React.useEffect(() => {
    document.body.style.backgroundColor = Color.BACKGROUND_BLACK;
    document
      .querySelector('meta[name="theme-color"]')!
      .setAttribute("content", Color.BACKGROUND_BLACK);
  }, []);

  return (
    <Container>
      <Wrapper>
        <LandscapeText
          className="font-secondary-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.2 }}
        >
          Please adjust your device to portrait mode for the best viewing
          experience.
          {!isPwa && (
            <>
              <br />
              <br />
              <br />
              <br />
            </>
          )}
        </LandscapeText>
      </Wrapper>
    </Container>
  );
};

export default Landscape;

const Container = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Color.WHITE};
  background-color: ${Color.BACKGROUND_BLACK};
  cursor: none;
  user-select: none;
`;

const Wrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;

  @media ${layout.up.sm} {
    width: 70%;
  }
`;

const LandscapeText = styled(motion.p)`
  font-size: 6vw;
  line-height: 1.65;
  margin-bottom: 15px;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    font-size: 3vw;
    line-height: 1.8;
  }

  @media ${layout.up.lg} {
    font-size: 1.85vw;
  }
`;
