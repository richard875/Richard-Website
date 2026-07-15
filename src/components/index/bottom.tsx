import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import SplitText from "../motion/SplitText";
import ResumeCircle from "../global/resumeCircle";
import PillCallToAction from "../global/pillCallToAction";
import BottomBackdrop from "./bottomBackdrop";
import {
  INDEX_TO_INTRO,
  CONTACT_GITHUB,
  CONTACT_LINKEDIN,
  INDEX_TO_ACKNOWLEDGEMENT_MOBILE,
} from "../../constants/googleTags";
import { NAME, GITHUB_URL, LINKEDIN_URL } from "../../constants/meta";

const ENTRANCE_DELAY = 0.9;

const Bottom = ({
  setHover,
  isIphoneXPwa,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
  isIphoneXPwa: boolean;
}) => {
  // Non-text elements (button, social) fade up on the shared entrance
  // beat; the text lines get the per-character split reveal.
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <Container>
      <BottomBackdrop />
      <div>
        <SmallText>
          <SplitText
            as="h3"
            className="font-primary-normal mt-4 mb-6"
            delay={ENTRANCE_DELAY + 0.07}
          >
            From Australia with Love
          </SplitText>
        </SmallText>
        <Name className="font-primary-bold">
          <SplitText
            as="h1"
            className="split-hero"
            delay={ENTRANCE_DELAY + 0.12}
          >
            {NAME.toUpperCase()}
          </SplitText>
        </Name>
        <SmallText className="font-primary-normal mt-5 sm:mt-8">
          <SplitText as="h2" delay={ENTRANCE_DELAY + 0.18}>
            Software Engineer &amp; Creative Designer
          </SplitText>
        </SmallText>
        <SmallText className="font-primary-normal mt-1/2 sm:mt-1">
          <SplitText as="h2" delay={ENTRANCE_DELAY + 0.26}>
            Sydney, Australia
          </SplitText>
        </SmallText>
        <Button id={`${INDEX_TO_INTRO}_0`} {...fade(ENTRANCE_DELAY + 0.36)}>
          <PillCallToAction
            name="My Experience"
            tagId={INDEX_TO_INTRO}
            tagIdStartNum={1}
            forward={true}
            route={Route.Intro}
            setHover={setHover}
          />
        </Button>
        <Social {...fade(ENTRANCE_DELAY + 0.46)}>
          <a
            id={`${CONTACT_LINKEDIN}_0`}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Richard Everley on LinkedIn"
            className="cursor-none"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <motion.span
              className="inline-block"
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FontAwesomeIcon size={"2x"} icon={faLinkedin} />
            </motion.span>
          </a>
          <a
            id={`${CONTACT_GITHUB}_0`}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Richard Everley on GitHub"
            className="cursor-none"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <motion.span
              className="inline-block"
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FontAwesomeIcon size={"2x"} icon={faGithub} />
            </motion.span>
          </a>
        </Social>
      </div>
      <div className="absolute right-7 bottom-16 sm:right-10 sm:bottom-20 lg:right-14 lg:bottom-14">
        <ResumeCircle isHome={true} setHover={setHover} />
      </div>
      <Country id={`${INDEX_TO_ACKNOWLEDGEMENT_MOBILE}_0`}>
        <h2
          id={`${INDEX_TO_ACKNOWLEDGEMENT_MOBILE}_1`}
          className="font-primary-normal select-none"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {!isIphoneXPwa && (
            <a
              href={Route.Acknowledgement}
              className="cursor-none"
              onClick={(e) => routeTo(e, Route.Acknowledgement)}
            >
              <SplitText as="span" delay={ENTRANCE_DELAY + 0.5}>
                Acknowledgement of Country
              </SplitText>
            </a>
          )}
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
  /* Contain the backdrop's negative z-index so it can never slip
     behind this element's own background. */
  isolation: isolate;
  padding: 15px 12px 5px 12px;
  background: linear-gradient(
    -45deg,
    #f9c41a,
    #f4b942,
    #ff8a50,
    #ff6b9d,
    #f55591,
    #ff6b9d,
    #ff8a50,
    #f4b942,
    #f9c41a
  );

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
  -webkit-text-stroke: 0.125rem ${Color.BLACK};

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
  margin-top: 20px;
  width: fit-content;

  @media ${layout.up.sm} {
    margin-top: 50px;
  }
`;

const Social = styled(motion.div)`
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
