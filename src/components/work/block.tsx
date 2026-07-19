import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CSSTransition } from "react-transition-group";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import SplitText from "../motion/SplitText";
import TextSection from "../global/textSection";
import iconPicker from "../../helper/iconPicker";
import mediaPicker from "../../helper/mediaPicker";
import getTransitionColor from "../../helper/getTransitionColor";
import WorkExperience from "../../types/workExperience";
import SentenceDescription from "../../types/sentenceDescription";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/margin";

// How much later each successive block's title starts revealing relative to
// the previous one (on top of its own internal char-by-char stagger).
const TITLE_STAGGER = 0.15;

const Block = ({
  index,
  dataLength,
  experience,
  setHover,
  isDarkMode,
}: {
  index: number;
  dataLength: number;
  experience: WorkExperience;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const clickableRef = React.useRef<HTMLAnchorElement>(null);
  const [displayMedia, setDisplayMedia] = React.useState(false);

  return (
    <Container
      className="font-primary-normal"
      $isLast={index == dataLength - 1}
      $isDarkMode={isDarkMode}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.1 * (index + 2),
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Logo
          $height={experience.imageHeight}
          src={iconPicker(experience.company, isDarkMode)}
          alt={experience.companyTitle}
        />
        <JobTitle $isDarkMode={isDarkMode}>
          <SplitText as="span" delay={0.12 + TITLE_STAGGER * index}>
            {experience.jobTitle}
          </SplitText>
        </JobTitle>
        <Company>
          <SplitText as="span" delay={0.2 + TITLE_STAGGER * index}>
            {experience.companyTitle}
          </SplitText>
        </Company>
        <Secondary className="mt-6 xxxl:mt-9">
          {experience.start === experience.end
            ? experience.start
            : `${experience.start} — ${experience.end}`}
        </Secondary>
        <Secondary>
          {experience.city}, {experience.country}
        </Secondary>
        <DescriptionText $isFirst={false}>
          <span style={{ color: isDarkMode ? Color.BLUE : Color.RED }}>
            Tech stack:
          </span>
          {experience.techStack.map(
            (tech: string, index: number) =>
              `${index == 0 ? " " : " • "}${tech}`,
          )}
        </DescriptionText>
        {experience.description.map(
          (description: SentenceDescription[], index: number) => (
            <DescriptionText key={index} $isFirst={index == 0}>
              {description.map(
                (sentence: SentenceDescription, index: number) => (
                  <TextSection
                    key={index}
                    isFirst={index == 0}
                    isExperience={true}
                    exproName={experience.company}
                    clickableRef={clickableRef}
                    setHover={setHover}
                    setDisplayMedia={setDisplayMedia}
                    isDarkMode={isDarkMode}
                    {...sentence} // content and url
                  />
                ),
              )}
            </DescriptionText>
          ),
        )}
        {!!experience.media && (
          <CSSTransition
            nodeRef={mediaRef}
            in={displayMedia}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Media
              ref={mediaRef}
              $top={clickableRef.current?.getBoundingClientRect().top!}
            >
              <Video
                preload="auto"
                $isDarkMode={isDarkMode}
                autoPlay
                loop
                muted
              >
                <source src={mediaPicker(experience.media!)} type="video/mp4" />
              </Video>
            </Media>
          </CSSTransition>
        )}
      </motion.div>
    </Container>
  );
};

export default Block;

const Container = styled.div<{
  $isLast: boolean;
  $isDarkMode: boolean;
}>`
  margin-top: 30px;
  padding-bottom: 10px;
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};
  border-right: none;

  @media ${layout.up.md} {
    margin-top: 0;
    padding-bottom: 0;
    width: ${BLOCK_WIDTH + "px"};
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
    border-right: ${({ $isLast, $isDarkMode }) =>
      !$isLast && `0.5px solid ${getTransitionColor(!$isDarkMode)}`};
  }

  @media ${layout.up.xxxl} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const Logo = styled.img<{ $height: number }>`
  width: auto;
  height: ${({ $height }) => $height + "px"};
  margin-top: ${({ $height }) =>
    15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  margin-bottom: ${({ $height }) =>
    15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  user-select: none;

  @media ${layout.up.md} {
    margin-top: ${({ $height }) =>
      10 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
    margin-bottom: ${({ $height }) =>
      30 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const JobTitle = styled.h2<{ $isDarkMode: boolean }>`
  font-size: 22px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.BLUE : Color.RED)};

  @media ${layout.up.xxxl} {
    font-size: 24px;
  }
`;

const Company = styled.h2`
  font-size: 22px;

  @media ${layout.up.xxxl} {
    font-size: 24px;
  }
`;

const Secondary = styled.h3`
  font-size: 16px;

  @media ${layout.up.xxxl} {
    font-size: 18px;
  }
`;

const DescriptionText = styled.p<{ $isFirst: boolean }>`
  font-size: 18px;
  line-height: 25px;
  margin-top: ${({ $isFirst }) => ($isFirst ? "25px" : "20px")};

  @media ${layout.up.md} {
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  @media ${layout.up.xxxl} {
    font-size: 20px;
    line-height: 30px;
    margin-top: ${({ $isFirst }) => ($isFirst ? "40px" : "20px")};
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Media = styled.div<{ $top: number }>`
  display: none;
  position: absolute;
  z-index: 99999 !important;
  bottom: ${({ $top }) => `calc(100dvh - ${$top}px + 20px)`};

  @media ${layout.up.md} {
    display: block;
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  @media ${layout.up.xxxl} {
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Video = styled.video<{ $isDarkMode: boolean }>`
  border-radius: 10px;
  z-index: 99999 !important;
  background-color: ${({ $isDarkMode }) =>
    `${getTransitionColor(!$isDarkMode)}`};
  --tw-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored:
    0 10px 15px -3px var(--tw-shadow-color),
    0 4px 6px -4px var(--tw-shadow-color);
  box-shadow:
    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
`;
