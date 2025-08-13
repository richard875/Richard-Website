import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { StaticImage } from "gatsby-plugin-image";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import getResume from "../../helper/getResume";
import { resumeCircleButtonEffect } from "../../helper/framerConfig";
import { INDEX_RESUME, CONTACT_RESUME } from "../../constants/googleTags";

const ARROW = "../../../static/images/indexCircle/arrow.svg";
const CIRCLE = "../../../static/images/indexCircle/circle.png";

const ResumeCircle = ({
  isHome,
  setHover,
}: {
  isHome: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const googleTag = isHome ? INDEX_RESUME : CONTACT_RESUME;
  const motionInitial = isHome ? { opacity: 0, scale: 0.5 } : { opacity: 0 };
  const motionAnimate = isHome ? { opacity: 1, scale: 1 } : { opacity: 1 };
  const motionTransition = isHome
    ? { duration: 2, delay: 1.5, ease: [0, 0.71, 0.2, 1.01] }
    : { duration: 0.4, delay: 0.3, ease: [0, 0.71, 0.2, 1.01] };
  const arrowClass = isHome
    ? "!relative !w-[45px] sm:!w-[50px] lg:!w-[60px] !left-[42px] !bottom-[75px] sm:!left-[50px] sm:!bottom-[86px] lg:!left-[55px] lg:!bottom-[98px]"
    : "!relative !w-[60px] sm:!w-[72px] lg:!w-[80px] !left-[55px] !bottom-[98px] sm:!left-[64px] sm:!bottom-[115px] lg:!left-[85px] lg:!bottom-[142px]";

  return (
    <motion.div whileHover={resumeCircleButtonEffect} className="w-fit">
      <CircleContainer
        id={`${googleTag}_0`}
        $isHome={isHome}
        initial={motionInitial}
        animate={motionAnimate}
        transition={motionTransition}
        onClick={(e) => getResume(e)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Circle id={`${googleTag}_1`}>
          <StaticImage
            id={`${googleTag}_2`}
            alt="Resume Circle"
            src={CIRCLE}
            className="relative h-5/6 w-5/6"
            placeholder="none"
          />
        </Circle>
        <StaticImage
          id={`${googleTag}_3`}
          alt="Resume Circle"
          src={ARROW}
          className={arrowClass}
          placeholder="none"
        />
      </CircleContainer>
    </motion.div>
  );
};

export default ResumeCircle;

const CircleContainer = styled(motion.div)<{ $isHome: boolean }>`
  width: ${({ $isHome }) => ($isHome ? "130px" : "170px")};
  height: ${({ $isHome }) => ($isHome ? "130px" : "170px")};
  user-select: none;
  border-radius: 99px;

  @media ${layout.up.sm} {
    width: ${({ $isHome }) => ($isHome ? "150px" : "200px")};
    height: ${({ $isHome }) => ($isHome ? "150px" : "200px")};
  }

  @media ${layout.up.lg} {
    width: ${({ $isHome }) => ($isHome ? "170px" : "250px")};
    height: ${({ $isHome }) => ($isHome ? "170px" : "250px")};
  }
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 199px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid ${Color.BLACK};
  background: ${Color.BRIGHT_GREEN};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    100% {
      transform: rotate(-360deg);
    }
  }
`;
