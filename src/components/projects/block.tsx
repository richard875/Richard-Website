import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CSSTransition } from "react-transition-group";
import Color from "../../enums/color";
import ProjectLink from "./projectLink";
import layout from "../../styles/layout";
import SplitText from "../motion/splitText";
import TextSection, { DescriptionText } from "../global/textSection";
import iconPicker from "../../helper/iconPicker";
import mediaPicker from "../../helper/mediaPicker";
import getTransitionColor from "../../helper/getTransitionColor";
import MyProjects from "../../types/myProjects";
import SentenceDescription from "../../types/sentenceDescription";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/margin";

// How much margin-top the first description paragraph gets at the `xxxl`
// breakpoint on this page — see DescriptionText in global/textSection.tsx.
const FIRST_DESCRIPTION_MARGIN_TOP_XXXL = 35;

// How much later each successive block's title starts revealing relative to
// the previous one (on top of its own internal char-by-char stagger).
const TITLE_STAGGER = 0.15;

const Block = ({
  project,
  dataLength,
  index,
  setHover,
  isDarkMode,
}: {
  project: MyProjects;
  dataLength: number;
  index: number;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const clickableRef = React.useRef<HTMLAnchorElement>(null);
  const [displayMedia, setDisplayMedia] = React.useState(false);

  return (
    <Container
      className="font-primary-normal"
      $isFirst={index == 0}
      $isLast={index == dataLength - 1}
      $isDarkMode={isDarkMode}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.1 * (index + 3),
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Logo
          $height={project.imageHeight}
          src={iconPicker(project.image, isDarkMode)}
          alt={project.imageAlt}
        />
        <ProjectName $isDarkMode={isDarkMode}>
          <SplitText
            as="span"
            className="split-medium"
            delay={0.2 + TITLE_STAGGER * index}
          >
            {project.name}
          </SplitText>
        </ProjectName>
        <DescriptionText
          $isFirst={false}
          $firstMarginTopXxxl={FIRST_DESCRIPTION_MARGIN_TOP_XXXL}
        >
          <span style={{ color: isDarkMode ? Color.BLUE : Color.RED }}>
            Utilised:
          </span>
          {project.techStack.map(
            (tech: string, index: number) =>
              `${index == 0 ? " " : " • "}${tech}`,
          )}
        </DescriptionText>
        {project.description.map(
          (description: SentenceDescription[], index: number) => {
            return (
              <DescriptionText
                key={index}
                $isFirst={index == 0}
                $firstMarginTopXxxl={FIRST_DESCRIPTION_MARGIN_TOP_XXXL}
              >
                {description.map(
                  (sentence: SentenceDescription, index: number) => (
                    <TextSection
                      key={index}
                      isFirst={index == 0}
                      isExperience={false}
                      exproName={project.image}
                      clickableRef={clickableRef}
                      setHover={setHover}
                      setDisplayMedia={setDisplayMedia}
                      isDarkMode={isDarkMode}
                      {...sentence} // content and url
                    />
                  ),
                )}
              </DescriptionText>
            );
          },
        )}
        {!!project.linkUrl && (
          <div className="mt-3.75 md:mt-5">
            <ProjectLink
              url={project.linkUrl!}
              name={project.image}
              setHover={setHover}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
        {!!project.media && (
          <CSSTransition
            nodeRef={mediaRef}
            in={displayMedia}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <MediaWrapper
              $top={clickableRef.current?.getBoundingClientRect().bottom!}
            >
              <Media
                $portraitOperation={project.portraitOperation!}
                $widthLarge={project.widthLarge!}
                $widthMedium={project.widthMedium!}
                ref={mediaRef}
              >
                <Video
                  autoPlay
                  loop
                  muted
                  preload="auto"
                  $isDarkMode={isDarkMode}
                  $portraitOperation={project.portraitOperation!}
                >
                  <source src={mediaPicker(project.media!)} type="video/mp4" />
                </Video>
              </Media>
            </MediaWrapper>
          </CSSTransition>
        )}
      </motion.div>
    </Container>
  );
};

export default Block;

const Container = styled.div<{
  $isFirst: boolean;
  $isLast: boolean;
  $isDarkMode: boolean;
}>`
  margin-top: ${({ $isFirst }) => ($isFirst ? "20px" : "25px")};
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
  height: ${({ $height }) => $height + "px"};
  width: auto;
  margin-bottom: ${({ $height }) =>
    15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  user-select: none;

  @media ${layout.up.md} {
    margin-top: ${({ $height }) =>
      10 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const MediaWrapper = styled.div<{ $top: number }>`
  display: none;
  position: absolute;
  z-index: 99999 !important;
  top: ${({ $top }) => $top + 15 + "px"};

  @media ${layout.up.md} {
    display: block;
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  @media ${layout.up.xxxl} {
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Media = styled.div<{
  $portraitOperation: boolean;
  $widthLarge: string;
  $widthMedium: string;
}>`
  margin: 0 auto;
  width: ${({ $portraitOperation, $widthMedium }) =>
    $portraitOperation ? $widthMedium : "100%"};

  @media ${layout.up.xxxl} {
    width: ${({ $portraitOperation, $widthLarge }) =>
      $portraitOperation ? $widthLarge : "100%"};
  }
`;

const Video = styled.video<{
  $isDarkMode: boolean;
  $portraitOperation: boolean;
}>`
  border-radius: ${({ $portraitOperation }) =>
    $portraitOperation ? "20px" : "10px"};
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

const ProjectName = styled.h2<{ $isDarkMode: boolean }>`
  font-size: 22px;
  line-height: 30px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.BLUE : Color.RED)};

  @media ${layout.up.xxxl} {
    font-size: 24px;
  }
`;
