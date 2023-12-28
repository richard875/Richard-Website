import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import ResumeCircle from "../global/resumeCircle";
import {
  INDEX_TO_INTRO,
  INDEX_TO_ACKNOWLEDGEMENT_MOBILE,
} from "../../constants/googleTags";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const Bottom = ({
  setHover,
  isIphoneXPwa,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
  isIphoneXPwa: boolean;
}) => {
  const topGreetingRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const sub1Ref = React.useRef(null);
  const sub2Ref = React.useRef(null);
  const contactRef = React.useRef(null);
  const countryRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1 });
    gsap.from(topGreetingRef.current, gsapAnimationIndex(450, 1, 0));
    gsap.from(nameRef.current, gsapAnimationIndex(350, 1.2, 0));
    gsap.from(sub1Ref.current, gsapAnimationIndex(350, 1.3, 0));
    gsap.from(sub2Ref.current, gsapAnimationIndex(350, 1.4, 0));
    gsap.from(contactRef.current, gsapAnimationIndex(350, 1.5, 0));
    gsap.from(countryRef.current, gsapAnimationIndex(350, 1.6, 0));
  }, []);

  return (
    <Container>
      <SmallText>
        <h3 ref={topGreetingRef} className="font-primary-normal mt-4 mb-6">
          From Australia with Love
        </h3>
      </SmallText>
      <Name className="font-primary-bold">
        <h1 ref={nameRef}>RICHARD LEE</h1>
      </Name>
      <SmallText className="font-primary-normal mt-5 sm:mt-8">
        <h2 ref={sub1Ref}>Software Engineer &amp; Creative Designer</h2>
      </SmallText>
      <SmallText className="font-primary-normal mt-1/2 sm:mt-1">
        <h2 ref={sub2Ref}>Sydney, Australia</h2>
      </SmallText>
      <Button id={`${INDEX_TO_INTRO}_0`}>
        <div
          ref={contactRef}
          id={`${INDEX_TO_INTRO}_1`}
          className="flex items-center font-secondary-normal"
        >
          <h2
            id={`${INDEX_TO_INTRO}_2`}
            className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2"
            onClick={(e) => routeTo(e, Route.Intro)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            My experience
          </h2>
          <FontAwesomeIcon
            id={`${INDEX_TO_INTRO}_3`}
            icon={faCircleChevronRight}
            className="mt-1"
            size={"sm"}
          />
        </div>
      </Button>
      <Country id={`${INDEX_TO_ACKNOWLEDGEMENT_MOBILE}_0`}>
        <h2
          ref={countryRef}
          id={`${INDEX_TO_ACKNOWLEDGEMENT_MOBILE}_1`}
          className="font-primary-normal select-none"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => routeTo(e, Route.Acknowledgement)}
        >
          {!isIphoneXPwa && "Acknowledgement of Country"}
        </h2>
      </Country>
      <ResumeCircle isHome={true} setHover={setHover} />
    </Container>
  );
};

export default Bottom;

const Container = styled.div`
  flex: 1;
  padding: 15px 12px;
  background: linear-gradient(90deg, #f55591 0%, #f9c41a 100%);

  @media ${layout.up.sm} {
    padding: 3vh 5vw;
  }

  @media ${layout.up.lg} {
    padding: 3vh 3vw;
  }
`;

const SmallText = styled.div`
  font-size: 18px;
  overflow: hidden;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    font-size: 20px;
  }

  @media ${layout.up.xxl} {
    font-size: 25px;
  }
`;

const Name = styled.div`
  font-size: 73px;
  line-height: 70px;
  overflow: hidden;
  color: ${Color.WHITE};
  -webkit-text-stroke: 0.12rem ${Color.BLACK};

  @media ${layout.up.sm} {
    font-size: 80px;
    line-height: 80px;
  }

  @media ${layout.up.lg} {
    font-size: 100px;
    line-height: 100px;
  }

  @media ${layout.up.xxl} {
    margin-top: 1vw;
    font-size: 130px;
    line-height: 120px;
  }
`;

const Button = styled.div`
  font-size: 16px;
  margin-top: 20px;
  overflow: hidden;
  user-select: none;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    font-size: 18px;
    margin-top: 50px;
  }

  @media ${layout.up.xxl} {
    font-size: 20px;
  }
`;

const Country = styled.div`
  bottom: 1.5vh;
  font-size: 16px;
  overflow: hidden;
  position: absolute;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    bottom: 8vh;
    font-size: 17px;
  }

  @media ${layout.up.lg} {
    display: none;
  }
`;
