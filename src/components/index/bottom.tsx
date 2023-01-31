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
  acknowledgement,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
  acknowledgement: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const topNameRef = React.useRef(null);
  const topGreetingRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const sub1Ref = React.useRef(null);
  const sub2Ref = React.useRef(null);
  const contactRef = React.useRef(null);
  const countryRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(topNameRef.current, gsapAnimationIndex(450, 2.2, 0));
    gsap.from(topGreetingRef.current, gsapAnimationIndex(450, 2.2, 0));
    gsap.from(nameRef.current, gsapAnimationIndex(450, 2.5, 0));
    gsap.from(sub1Ref.current, gsapAnimationIndex(350, 2.6, 0));
    gsap.from(sub2Ref.current, gsapAnimationIndex(350, 2.8, 0));
    gsap.from(contactRef.current, gsapAnimationIndex(350, 3.1, 0));
    gsap.from(countryRef.current, gsapAnimationIndex(350, 3.3, 0));
  }, []);

  return (
    <Container>
      <SmallText>
        <div ref={topGreetingRef} className="font-primary-normal mt-4 mb-6">
          From Australia with Love
        </div>
      </SmallText>
      <Name className="font-primary-bold">
        <div ref={nameRef}>RICHARD LEE</div>
      </Name>
      <SmallText className="font-primary-normal mt-5 sm:mt-8">
        <div ref={sub1Ref}>Software Engineer &amp; Creative Designer</div>
      </SmallText>
      <SmallText className="font-primary-normal mt-2 sm:mt-1">
        <div ref={sub2Ref}>University of Sydney</div>
      </SmallText>
      <Button>
        <div ref={contactRef} className="flex items-center">
          <div
            className="pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4 font-primary-normal"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Let's catch up
          </div>
          <FontAwesomeIcon icon={faAngleRight} size={"xs"} className="mt-0.5" />
        </div>
      </Button>

      <Country>
        <div
          ref={countryRef}
          className="font-primary-normal"
          onClick={(e) => acknowledgement(e)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {useBreakpoint(down("lg")) && "Acknowledgement of Country"}
        </div>
      </Country>

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
    padding: 3vh 5vw;
  }

  ${up("lg")} {
    padding: 3vh 3vw;
  }
`;

const SmallText = styled.div`
  font-size: 18px;
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

const Button = styled.div`
  font-size: 18px;
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
  font-size: 16px;
  position: absolute;
  bottom: 15vh;
  color: ${COLOR.WHITE};
  overflow: hidden;

  ${up("sm")} {
    font-size: 17px;
    bottom: 8vh;
  }
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
  bottom: 21vh;
  right: 45px;
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);
  user-select: none;

  &:hover {
    transform: rotate(-360deg) scale(1.07);
  }

  ${up("sm")} {
    bottom: 10vh;
    right: 75px;
  }

  ${up("lg")} {
    bottom: 12vh;
    right: 115px;
  }

  ${up("xxl")} {
    bottom: 15vh;
    right: calc(150px - 0.7vw);
  }
`;
