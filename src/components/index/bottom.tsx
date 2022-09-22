import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up, down, between } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
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
  const topNameRef = React.useRef(null);
  const topGreetingRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const sub1Ref = React.useRef(null);
  const sub2Ref = React.useRef(null);
  const contactRef = React.useRef(null);
  const countryRef = React.useRef(null);
  const mobileCountryRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(topNameRef.current, gsapAnimationIndex(450, 2.2, 0));
    gsap.from(topGreetingRef.current, gsapAnimationIndex(450, 2.2, 0));
    gsap.from(nameRef.current, gsapAnimationIndex(450, 2.5, 0));
    gsap.from(sub1Ref.current, gsapAnimationIndex(350, 2.6, 0));
    gsap.from(sub2Ref.current, gsapAnimationIndex(350, 2.8, 0));
    gsap.from(contactRef.current, gsapAnimationIndex(350, 3.1, 0));
    gsap.from(countryRef.current, gsapAnimationIndex(350, 3.3, 0));
    gsap.from(mobileCountryRef.current, gsapAnimationIndex(350, 3.5, 0));
  }, []);

  return (
    <Container>
      <SmalllText>
        <div ref={topNameRef}>
          {useBreakpoint(down("sm")) && (
            <div className="flex items-center justify-between font-primary-bold mt-3 mb-8">
              <div>hello@richard-lee.com</div>
              <div>PROJECTS</div>
            </div>
          )}
        </div>
      </SmalllText>
      <SmalllText>
        <div ref={topGreetingRef}>
          {useBreakpoint(up("sm")) && (
            <div className="font-primary-bold mt-4 mb-6">
              From Australia with Love
            </div>
          )}
        </div>
      </SmalllText>
      <Name className="font-secondary-normal">
        <div ref={nameRef}>RICHARD LEE</div>
      </Name>
      <Subtitle className="font-primary-bold mt-5 sm:mt-8">
        <div ref={sub1Ref}>SOFTWARE ENGINEER &amp; CREATIVE DESIGNER</div>
      </Subtitle>
      <Subtitle className="font-primary-bold mt-2 sm:mt-4">
        <div ref={sub2Ref}>UNIVERSITY OF SYDNEY</div>
      </Subtitle>
      <Button>
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
      <Country>
        <div ref={countryRef}>
          {useBreakpoint(down("sm")) && <>From Australia with Love</>}
          {useBreakpoint(between("sm", "lg")) && (
            <>Acknowledgement of Country</>
          )}
        </div>
      </Country>
      <Acknowledgement>
        <div ref={mobileCountryRef}>
          {useBreakpoint(down("sm")) && <>Acknowledgement of Country</>}
        </div>
      </Acknowledgement>
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
          <Circle>
            <StaticImage
              className="relative h-5/6 w-5/6"
              src="../../images/circle.png"
              alt="Resume Circle"
              placeholder="none"
            />
          </Circle>
          {useBreakpoint(down("sm")) && (
            <StaticImage
              width={45}
              style={{
                position: "absolute",
                left: 42.5,
                bottom: 56,
              }}
              src="../../images/arrow.svg"
              alt="Resume Circle"
              placeholder="none"
            />
          )}
          {useBreakpoint(between("sm", "lg")) && (
            <StaticImage
              width={50}
              style={{
                position: "absolute",
                left: 50,
                bottom: 65,
              }}
              src="../../images/arrow.svg"
              alt="Resume Circle"
              placeholder="none"
            />
          )}
          {useBreakpoint(up("lg")) && (
            <StaticImage
              width={60}
              style={{
                position: "absolute",
                left: 55,
                bottom: 72,
              }}
              src="../../images/arrow.svg"
              alt="Resume Circle"
              placeholder="none"
            />
          )}
        </motion.div>
      </CircleContainer>
    </Container>
  );
};

export default Bottom;

const Container = styled.div`
  flex: 1;
  padding: 15px 12px;
  background: linear-gradient(90deg, #f55591 0%, #f9c41a 100%);

  ${up("sm")} {
    padding: 30px 30px;
  }

  ${up("lg")} {
    padding: 10px 30px;
  }

  ${up("xxl")} {
    padding: 3vh 3vw;
  }
`;

const SmalllText = styled.div`
  color: ${COLOR.WHITE};
  overflow: hidden;

  ${up("sm")} {
    font-size: 20px;
  }

  ${up("xxl")} {
    font-size: 25px;
  }
`;

const Name = styled.div`
  font-size: 73px;
  line-height: 70px;
  overflow: hidden;
  color: ${COLOR.WHITE};
  -webkit-text-stroke: 0.12rem ${COLOR.BLACK};

  ${up("sm")} {
    font-size: 80px;
    line-height: 80px;
  }

  ${up("lg")} {
    font-size: 100px;
    line-height: 100px;
  }

  ${up("xxl")} {
    margin-top: 1vw;
    font-size: 130px;
    line-height: 120px;
  }
`;

const Subtitle = styled.div`
  line-height: 18px;
  overflow: hidden;
  color: ${COLOR.WHITE};

  ${up("sm")} {
    font-size: 23px;
    line-height: 30px;
  }

  ${up("xxl")} {
    font-size: 30px;
    line-height: 36px;
  }
`;

const Button = styled.div`
  margin-top: 50px;
  color: ${COLOR.WHITE};
  user-select: none;
  overflow: hidden;

  ${up("sm")} {
    font-size: 20px;
  }

  ${up("xxl")} {
    font-size: 23px;
  }
`;

const Country = styled.div`
  font-size: 14px;
  position: absolute;
  bottom: 16vh;
  color: ${COLOR.WHITE};
  overflow: hidden;

  ${up("sm")} {
    font-size: 17px;
    bottom: 8vh;
  }
`;

const Acknowledgement = styled.div`
  font-size: 14px;
  position: absolute;
  bottom: 13vh;
  color: ${COLOR.WHITE};
  overflow: hidden;
`;

const Circle = styled.div`
  width: 130px;
  height: 130px;
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

  ${up("sm")} {
    width: 150px;
    height: 150px;
  }

  ${up("lg")} {
    width: 170px;
    height: 170px;
  }
`;

const CircleContainer = styled.span`
  position: absolute;
  bottom: 16vh;
  right: 30px;
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);
  user-select: none;

  &:hover {
    transform: rotate(-360deg) scale(1.07);
  }

  ${up("sm")} {
    bottom: 10vh;
    right: 35px;
  }

  ${up("lg")} {
    bottom: 110px;
    right: 50px;
  }

  ${up("xxl")} {
    bottom: 15vh;
    right: calc(150px - 3.5vw);
  }
`;
