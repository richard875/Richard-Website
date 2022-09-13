import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { GatsbyLinkProps, Link } from "gatsby";
import styled from "styled-components";
import type { HeadFC } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Route from "../routes/route";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import mousePositionType from "../types/mousePositionType";
import gsapAnimationIndex from "../helper/gsapAnimationIndex";
import Top from "../components/index/top";

const IndexPage = ({
  location,
}: {
  location: GatsbyLinkProps<mousePositionType>;
}) => {
  const acknowledgementRef = React.useRef(null);
  const timeRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const sub1Ref = React.useRef(null);
  const sub2Ref = React.useRef(null);
  const contactRef = React.useRef(null);

  const [hover, setHover] = React.useState(false);
  const [globalCoords, setGlobalCoords] = React.useState({
    x: 0,
    y: 0,
  } as mousePositionType);

  React.useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) =>
      setGlobalCoords({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, []);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(acknowledgementRef.current, gsapAnimationIndex(150, 3.4, 20));
    gsap.from(timeRef.current, gsapAnimationIndex(150, 3.4, 20));
    gsap.from(nameRef.current, gsapAnimationIndex(450, 2.5, 0));
    gsap.from(sub1Ref.current, gsapAnimationIndex(350, 2.6, 0));
    gsap.from(sub2Ref.current, gsapAnimationIndex(350, 2.8, 0));
    gsap.from(contactRef.current, gsapAnimationIndex(350, 3.1, 0));
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
        <Bottom>
          <Name className="font-secondary-normal">
            <div ref={nameRef}>RICHARD LEE</div>
          </Name>
          <Subtitle className="font-primary-bold mt-9">
            <div ref={sub1Ref}>
              SOFTWARE&nbsp;ENGINEER&nbsp;&amp;&nbsp;DESIGNER
            </div>
          </Subtitle>
          <Subtitle className="font-primary-bold mt-5">
            <div ref={sub2Ref}>UNIVERSITY OF SYDNEY</div>
          </Subtitle>
          <Button className="select-none overflow-hidden">
            <div ref={contactRef} className="flex items-center">
              <div
                className="pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                Let's catch up
              </div>
              <FontAwesomeIcon
                icon={faAngleRight}
                size={"xs"}
                className="mt-0.5"
              />
            </div>
          </Button>
          <CircleContainer
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 4,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <Circle className="select-none">
                <StaticImage
                  className="relative h-5/6 w-5/6"
                  src="../images/circle.svg"
                  alt="Resume Circle"
                  placeholder="none"
                />
              </Circle>
              <StaticImage
                width={60}
                style={Arrow}
                src="../images/arrow.svg"
                alt="Resume Circle"
                placeholder="none"
              />
            </motion.div>
          </CircleContainer>
        </Bottom>
      </Wrapper>
      <Footer>
        <FLeft ref={acknowledgementRef}>
          <div
            className="mr-3"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            From Australia with Love
          </div>
          <VerticalSeparator></VerticalSeparator>
          <Link to={Route.Acknowledgement} state={globalCoords}>
            <div
              className="ml-3"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Acknowledgement of Country
            </div>
          </Link>
        </FLeft>
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

const FLeft = styled.div`
  display: flex;
  align-items: center;
  padding-left: 98px;
`;

const FRight = styled.div`
  display: flex;
  align-items: center;
  padding-right: 98px;
`;

const VerticalSeparator = styled.div`
  width: 0px;
  height: 17px;
  border: 1px solid ${COLOR.BLACK};
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 7px;
  border-radius: 99px;
  background: #35be27;
`;

const Bottom = styled.div`
  flex: 1;
  padding: 95px 55px;
  background: linear-gradient(90deg, #f55591 0%, #f9c41a 100%);
`;

const Name = styled.div`
  font-size: 130px;
  line-height: 120px;
  overflow: hidden;
  color: ${COLOR.WHITE};
  -webkit-text-stroke: 0.12rem ${COLOR.BLACK};
`;

const Subtitle = styled.div`
  font-size: 30px;
  line-height: 36px;
  overflow: hidden;
  color: ${COLOR.WHITE};
`;

const Button = styled.div`
  margin-top: 50px;
  font-size: 23px;
  color: ${COLOR.WHITE};
`;

const Circle = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #cdff50;
  border: 2px solid ${COLOR.BLACK};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    100% {
      transform: rotate(-360deg);
    }
  }
`;

const CircleContainer = styled.span`
  position: absolute;
  bottom: 150px;
  right: 150px;
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);

  &:hover {
    transform: rotate(-360deg) scale(1.07);
  }
`;

const Arrow = {
  position: "absolute",
  left: 55,
  bottom: 72,
} as React.CSSProperties;
