import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { StaticImage } from "gatsby-plugin-image";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import getResume from "../../helper/getResume";
import { CONTACT_RESUME } from "../../constants/googleTags";

const ARROW = "../../../static/images/indexCircle/arrow.svg";
const CIRCLE = "../../../static/images/indexCircle/circle.png";

const ResumeCircle = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <CircleContainer
    id={`${CONTACT_RESUME}_0`}
    onClick={(e) => getResume(e)}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <motion.div
      id={`${CONTACT_RESUME}_1`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <Circle id={`${CONTACT_RESUME}_2`}>
        <StaticImage
          id={`${CONTACT_RESUME}_3`}
          alt="Resume Circle"
          src={CIRCLE}
          className="relative h-5/6 w-5/6"
          placeholder="none"
        />
      </Circle>
      <StaticImage
        id={`${CONTACT_RESUME}_4`}
        alt="Resume Circle"
        src={ARROW}
        className="!relative !w-[60px] md:!w-[72px] lg:!w-[80px] !left-[55px] !bottom-[98px] md:!left-[64px] md:!bottom-[115px] lg:!left-[85px] lg:!bottom-[142px]"
        placeholder="none"
      />
    </motion.div>
  </CircleContainer>
);

export default ResumeCircle;

const CircleContainer = styled.div`
  width: 170px;
  height: 170px;
  user-select: none;
  border-radius: 99px;
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);

  &:hover {
    transform: rotate(-170deg) scale(1.07);
  }

  @media ${layout.down.md} {
    margin-top: 30px;
  }

  @media ${layout.up.md} {
    width: 200px;
    height: 200px;
  }

  @media ${layout.up.lg} {
    width: 250px;
    height: 250px;
  }
`;

const Circle = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 199px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${Color.BLACK};
  background: ${Color.BRIGHT_GREEN};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    100% {
      transform: rotate(-360deg);
    }
  }

  @media ${layout.up.md} {
    width: 200px;
    height: 200px;
  }

  @media ${layout.up.lg} {
    width: 250px;
    height: 250px;
  }
`;
