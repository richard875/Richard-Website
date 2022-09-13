import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { COLOR } from "../../styles/theme";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const Bottom = ({
  setHover,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
}) => {
  const nameRef = React.useRef(null);
  const sub1Ref = React.useRef(null);
  const sub2Ref = React.useRef(null);
  const contactRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(nameRef.current, gsapAnimationIndex(450, 2.5, 0));
    gsap.from(sub1Ref.current, gsapAnimationIndex(350, 2.6, 0));
    gsap.from(sub2Ref.current, gsapAnimationIndex(350, 2.8, 0));
    gsap.from(contactRef.current, gsapAnimationIndex(350, 3.1, 0));
  }, []);

  return (
    <Container>
      <Name className="font-secondary-normal">
        <div ref={nameRef}>RICHARD LEE</div>
      </Name>
      <Subtitle className="font-primary-bold mt-9">
        <div ref={sub1Ref}>SOFTWARE&nbsp;ENGINEER&nbsp;&amp;&nbsp;DESIGNER</div>
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
          <FontAwesomeIcon icon={faAngleRight} size={"xs"} className="mt-0.5" />
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
              src="../../images/circle.svg"
              alt="Resume Circle"
              placeholder="none"
            />
          </Circle>
          <StaticImage
            width={60}
            style={Arrow}
            src="../../images/arrow.svg"
            alt="Resume Circle"
            placeholder="none"
          />
        </motion.div>
      </CircleContainer>
    </Container>
  );
};

export default Bottom;

const Container = styled.div`
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
