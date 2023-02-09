import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { CSSTransition } from "react-transition-group";
import { COLOR } from "../../styles/theme";
import iconPicker from "../../helper/iconPicker";
import TextWithLink from "../../components/projects/textWithLink";
import ProjectLink from "./projectLink";
import MyProjects from "../../types/myProjects";
import SentenceDescription from "../../types/sentenceDescription";
import workData from "../../../static/data/work.json";
import mediaPicker from "../../helper/mediaPicker";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/workPage";

const Block = ({
  project,
  index,
  setHover,
}: {
  project: MyProjects;
  index: number;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const [displayMedia, setDisplayMedia] = React.useState(false);

  return (
    <Container
      className="font-primary-normal"
      isLast={index == workData.length - 1}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.4 + 0.3 * (index + 2),
        }}
      >
        <Logo
          height={project.imageHeight}
          src={iconPicker(project.image, false)}
          alt={project.imageAlt}
        />
        <ProjectName
          onMouseEnter={() => setDisplayMedia(true)}
          onMouseLeave={() => setDisplayMedia(false)}
        >
          {project.name}
        </ProjectName>
        {project.description.map(
          (description: SentenceDescription[], index: number) => {
            return (
              <JobDescriptionText key={index} isFirst={index == 0}>
                {description.map(
                  (sentence: SentenceDescription, index: number) => (
                    <TextWithLink
                      key={index}
                      isFirst={index == 0}
                      setHover={setHover}
                      {...sentence} // content, isLink and url
                    />
                  )
                )}
              </JobDescriptionText>
            );
          }
        )}
        <JobDescriptionText isFirst={false}>
          - <span style={{ color: COLOR.RED }}>Utilised</span>:
          {project.techStack.map(
            (tech: string, index: number) =>
              `${index == 0 ? " " : " • "}${tech}`
          )}
        </JobDescriptionText>
        {project.hasLink && <ProjectLink setHover={setHover} />}
        {project.hasMedia && (
          <CSSTransition
            nodeRef={mediaRef}
            in={displayMedia}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Media
              portraitOperation={project.portraitOperation!}
              ref={mediaRef}
            >
              <Video
                autoPlay
                loop
                muted
                portraitOperation={project.portraitOperation!}
              >
                <source src={mediaPicker(project.media!)} type="video/mp4" />
              </Video>
            </Media>
          </CSSTransition>
        )}
      </motion.div>
    </Container>
  );
};

export default Block;

const Container = styled.div`
  margin-top: 30px;
  padding-bottom: 10px;
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};
  border-right: none;

  ${up("md")} {
    margin-top: 0;
    padding-bottom: 0;
    width: ${BLOCK_WIDTH + "px"};
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
    border-right: ${({ isLast }: { isLast: boolean }) =>
      !isLast && `0.5px solid ${COLOR.BACKGROUND_BLACK_SECONDARY}`};
  }

  ${up("xxxl")} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const Logo = styled.img`
  height: ${({ height }: { height: number }) => height + "px"};
  width: auto;
  margin-top: ${({ height }: { height: number }) =>
    15 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  margin-bottom: ${({ height }: { height: number }) =>
    15 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};

  ${up("md")} {
    margin-top: ${({ height }: { height: number }) =>
      10 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const Media = styled.div`
  position: absolute;
  bottom: 20px;

  ${up("md")} {
    width: ${({ portraitOperation }: { portraitOperation: boolean }) =>
      portraitOperation
        ? (BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP) * 0.6 + "px"
        : BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  ${up("xxxl")} {
    width: ${({ portraitOperation }: { portraitOperation: boolean }) =>
      portraitOperation
        ? (BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP) * 0.6 + "px"
        : BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  border-radius: ${({ portraitOperation }: { portraitOperation: boolean }) =>
    portraitOperation ? "25px" : "15px"};
  z-index: 99999 !important;
  background-color: ${COLOR.BACKGROUND_BLACK_SECONDARY};
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
    0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;

const ProjectName = styled.p`
  padding-bottom: 25px;
  font-size: 22px;
  line-height: 30px;
  color: ${COLOR.RED};

  ${up("xxxl")} {
    padding-bottom: 35px;
    font-size: 24px;
  }
`;

const JobDescriptionText = styled.p`
  margin-top: ${({ isFirst }: { isFirst: boolean }) => (isFirst ? 0 : "20px")};
  font-size: 18px;
  line-height: 25px;

  ${up("md")} {
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  ${up("xxxl")} {
    margin-top: ${({ isFirst }: { isFirst: boolean }) =>
      isFirst ? 0 : "20px"};
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
    font-size: 20px;
    line-height: 30px;
  }
`;
