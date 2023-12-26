import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CSSTransition } from "react-transition-group";
import Color from "../../enums/color";
import ProjectLink from "./projectLink";
import layout from "../../styles/layout";
import TextSection from "../global/textSection";
import iconPicker from "../../helper/iconPicker";
import mediaPicker from "../../helper/mediaPicker";
import MyProjects from "../../types/myProjects";
import SentenceDescription from "../../types/sentenceDescription";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/margin";

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ stiffness: 0, duration: 0.4, delay: 0.1 * (index + 3) }}
      >
        <Logo
          $height={project.imageHeight}
          src={iconPicker(project.image, isDarkMode)}
          alt={project.imageAlt}
        />
        <ProjectName $isDarkMode={isDarkMode}>{project.name}</ProjectName>
        <DescriptionText $isFirst={false}>
          <span style={{ color: isDarkMode ? Color.BLUE : Color.RED }}>
            Utilised:
          </span>
          {project.techStack.map(
            (tech: string, index: number) =>
              `${index == 0 ? " " : " • "}${tech}`
          )}
        </DescriptionText>
        {project.description.map(
          (description: SentenceDescription[], index: number) => {
            return (
              <DescriptionText key={index} $isFirst={index == 0}>
                {description.map(
                  (sentence: SentenceDescription, index: number) => (
                    <TextSection
                      key={index}
                      isFirst={index == 0}
                      clickableRef={clickableRef}
                      setHover={setHover}
                      setDisplayMedia={setDisplayMedia}
                      isDarkMode={isDarkMode}
                      {...sentence} // content and url
                    />
                  )
                )}
              </DescriptionText>
            );
          }
        )}
        {!!project.linkUrl && (
          <ProjectLink
            url={project.linkUrl!}
            setHover={setHover}
            isDarkMode={isDarkMode}
          />
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
  margin-top: ${({ $isFirst }) => ($isFirst ? "0" : "30px")};
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
      !$isLast &&
      ($isDarkMode
        ? `0.5px solid ${Color.BACKGROUND_WHITE_SECONDARY}`
        : `0.5px solid ${Color.BACKGROUND_BLACK}`)};
  }

  @media ${layout.up.xxxl} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const Logo = styled.img<{ $height: number }>`
  height: ${({ $height }) => $height + "px"};
  width: auto;
  margin-top: ${({ $height }) =>
    15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
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
    $isDarkMode ? Color.BACKGROUND_WHITE_SECONDARY : Color.BACKGROUND_BLACK};
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
    0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;

const ProjectName = styled.h2<{ $isDarkMode: boolean }>`
  font-size: 22px;
  line-height: 30px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.BLUE : Color.RED)};

  @media ${layout.up.xxxl} {
    font-size: 24px;
  }
`;

const DescriptionText = styled.p<{ $isFirst: boolean }>`
  margin-top: ${({ $isFirst }) => ($isFirst ? "25px" : "20px")};
  font-size: 18px;
  line-height: 25px;

  @media ${layout.up.md} {
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  @media ${layout.up.xxxl} {
    margin-top: ${({ $isFirst }) => ($isFirst ? "35px" : "20px")};
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
    font-size: 20px;
    line-height: 30px;
  }
`;
