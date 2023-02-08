import * as React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps } from "gatsby";
import styled from "styled-components";
import { NAME } from "../constants/meta";
import { up, down } from "styled-breakpoints";
import useWindowSize from "../hooks/useWindowSize";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/work/callToAction";
import Block from "../components/work/block";
import MousePosition from "../types/mousePosition";
import workData from "../../static/data/work.json";
import WorkExperience from "../types/workExperience";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../constants/workPage";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Work Experience";

const Work = ({ location }: { location: GatsbyLinkProps<MousePosition> }) => {
  const [hover, setHover] = React.useState(false);
  const component = React.useRef<HTMLDivElement>(null);
  const slider = React.useRef<HTMLDivElement>(null);
  let windowWidth = useWindowSize().width;

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE_SECONDARY;
  }, []);

  React.useLayoutEffect(() => {
    if (!!windowWidth && windowWidth > 768) {
      let ctx = gsap.context(() => {
        gsap.to(slider.current, {
          xPercent: -100,
          left: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: slider.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + slider.current!.offsetWidth,
          },
        });
      }, component);
      return () => ctx.revert();
    }
  }, [windowWidth]);

  return (
    <Layout>
      <Container
        ref={component}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.5,
        }}
      >
        <InitialTransition color={COLOR.BACKGROUND_WHITE_SECONDARY} />
        <Horizontal ref={slider} entryLength={workData.length}>
          {workData.map((experience: WorkExperience, index: number) => {
            return (
              <Block
                key={index}
                experience={experience}
                index={index}
                setHover={setHover}
              />
            );
          })}
        </Horizontal>
        <Top>
          <Title className="font-secondary-normal">
            {TITLE}&nbsp;&nbsp;&nbsp;&nbsp;
          </Title>
          <CallToAction setHover={setHover} />
        </Top>

        {isDesktop && (
          <Cursor
            hover={hover}
            delay={1.5}
            position={location.state!}
            isBlack={true}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Work;

export const Head: HeadFC = () => (
  <title>
    {TITLE} | {NAME}
  </title>
);

const Container = styled(motion.div)`
  cursor: none;
  background-color: ${COLOR.BACKGROUND_WHITE_SECONDARY};

  ${up("md")} {
    overflow-x: hidden;
  }
`;

const Top = styled.div`
  position: fixed;
  top: 0;
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - ${BLOCK_PADDING * 2 + "px"});
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 3px;
  border-bottom: 0.5px solid ${COLOR.BACKGROUND_BLACK_SECONDARY};
  background-color: ${COLOR.BACKGROUND_WHITE_SECONDARY};

  ${down("md")} {
    justify-content: space-between;
  }

  ${up("md")} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    width: calc(100% - ${BLOCK_PADDING_DESKTOP * 2 + "px"});
  }
`;

const Title = styled.p`
  font-size: 20px;

  ${up("md")} {
    font-size: 25px;
  }
`;

const Horizontal = styled.div`
  flex-wrap: wrap;
  padding-top: 40px;

  ${up("md")} {
    padding-top: 66px;
    padding-bottom: 20px;
    width: ${({ entryLength }: { entryLength: number }) =>
      `${entryLength * BLOCK_WIDTH}px`};
    height: 100vh;
    display: flex;
  }

  ${up("xxxl")} {
    width: ${({ entryLength }: { entryLength: number }) =>
      `${entryLength * BLOCK_WIDTH_DESKTOP}px`};
  }
`;
