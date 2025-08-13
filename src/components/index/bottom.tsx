import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import ResumeCircle from "../global/resumeCircle";
import {
  INDEX_TO_INTRO,
  CONTACT_GITHUB,
  CONTACT_LINKEDIN,
  INDEX_TO_ACKNOWLEDGEMENT_MOBILE,
} from "../../constants/googleTags";
import { myExpButtonEffect } from "../../helper/framerConfig";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";
import { NAME, GITHUB_URL, LINKEDIN_URL } from "../../constants/meta";

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
  const linkedinRef = React.useRef(null);
  const githubRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1 });
    gsap.from(topGreetingRef.current, gsapAnimationIndex(450, 1, 0));
    gsap.from(nameRef.current, gsapAnimationIndex(350, 1.2, 0));
    gsap.from(sub1Ref.current, gsapAnimationIndex(350, 1.3, 0));
    gsap.from(sub2Ref.current, gsapAnimationIndex(350, 1.4, 0));
    gsap.from(contactRef.current, gsapAnimationIndex(350, 1.5, 0));
    gsap.from(countryRef.current, gsapAnimationIndex(350, 1.6, 0));
    gsap.from(linkedinRef.current, gsapAnimationIndex(350, 1.7, 0));
    gsap.from(githubRef.current, gsapAnimationIndex(350, 1.7, 0));
  }, []);

  return (
    <Container>
      <div>
        <SmallText>
          <h3 ref={topGreetingRef} className="font-primary-normal mt-4 mb-6">
            From Australia with Love
          </h3>
        </SmallText>
        <Name className="font-primary-bold">
          <h1 ref={nameRef}>{NAME.toUpperCase()}</h1>
        </Name>
        <SmallText className="font-primary-normal mt-5 sm:mt-8">
          <h2 ref={sub1Ref}>Software Engineer &amp; Creative Designer</h2>
        </SmallText>
        <SmallText className="font-primary-normal mt-1/2 sm:mt-1">
          <h2 ref={sub2Ref}>Sydney, Australia</h2>
        </SmallText>
        <Button id={`${INDEX_TO_INTRO}_0`} whileHover={myExpButtonEffect}>
          <ButtonContainer
            ref={contactRef}
            id={`${INDEX_TO_INTRO}_1`}
            className="font-secondary-normal"
            onClick={(e) => routeTo(e, Route.Intro)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <h2 id={`${INDEX_TO_INTRO}_2`} className="text-black">
              My Experience
            </h2>
            <FontAwesomeIcon
              id={`${INDEX_TO_INTRO}_3`}
              icon={faChevronRight}
              className="text-black ml-2"
              size="sm"
            />
          </ButtonContainer>
        </Button>
        <Social>
          <FontAwesomeIcon
            ref={linkedinRef}
            id={`${CONTACT_LINKEDIN}_0`}
            size={"2x"}
            icon={faLinkedin}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
              e.preventDefault();
              window.open(LINKEDIN_URL, "_blank");
            }}
          />
          <FontAwesomeIcon
            ref={githubRef}
            id={`${CONTACT_GITHUB}_0`}
            size={"2x"}
            icon={faGithub}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
              e.preventDefault();
              window.open(GITHUB_URL, "_blank");
            }}
          />
        </Social>
      </div>
      <div className="absolute right-7 bottom-16 sm:right-10 sm:bottom-20 lg:right-14 lg:bottom-14">
        <ResumeCircle isHome={true} setHover={setHover} />
      </div>
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
    </Container>
  );
};

export default Bottom;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  padding: 15px 12px 5px 12px;
  background: linear-gradient(90deg, #f55591 0%, #f9c41a 100%);

  @media ${layout.up.sm} {
    padding: 3vh 5vw;
  }

  @media ${layout.up.lg} {
    padding: 3vh 3vw 3vw 3vw;
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

const Button = styled(motion.div)`
  font-size: 16px;
  margin-top: 20px;
  overflow: hidden;
  user-select: none;
  color: ${Color.WHITE};
  width: fit-content;

  @media ${layout.up.sm} {
    font-size: 18px;
    margin-top: 50px;
  }

  @media ${layout.up.xxl} {
    font-size: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 7px 15px;
  border-radius: 7px;
  background-color: ${Color.WHITE};
  border: 2.5px solid ${Color.BLACK};
`;

const Social = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 50px;
  overflow: hidden;
  color: ${Color.WHITE};
`;

const Country = styled.div`
  font-size: 16px;
  overflow: hidden;
  color: ${Color.WHITE};

  @media ${layout.up.sm} {
    font-size: 17px;
  }

  @media ${layout.up.lg} {
    display: none;
  }
`;
