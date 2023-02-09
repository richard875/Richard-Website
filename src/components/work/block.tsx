import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { CSSTransition } from "react-transition-group";
import { COLOR } from "../../styles/theme";
import iconPicker from "../../helper/iconPicker";
import TextWithLink from "../../components/work/textWithLink";
import WorkExperience from "../../types/workExperience";
import SentenceDescription from "../../types/sentenceDescription";
import workData from "../../../static/data/work.json";
import mediaPicker from "../../helper/mediaPicker";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
  MEDIA_TOP_OFFSET,
  MEDIA_TOP_OFFSET_DESKTOP,
} from "../../constants/workPage";

const Block = ({
  experience,
  index,
  setHover,
}: {
  experience: WorkExperience;
  index: number;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const clickableRef = React.useRef<HTMLAnchorElement>(null);
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
          height={experience.imageHeight}
          src={iconPicker(experience.company, false)}
          alt={experience.companyTitle}
        />
        <JobTitle>{experience.jobTitle}</JobTitle>
        <Company>{experience.companyTitle}</Company>
        <Secondary className="mt-6 xxxl:mt-9">
          {experience.start.desktop} — {experience.end.desktop}
        </Secondary>
        <Secondary>
          {experience.city}, {experience.country}
        </Secondary>
        {experience.description.map(
          (description: SentenceDescription[], index: number) => {
            return (
              <JobDescriptionText key={index} isFirst={index == 0}>
                {description.map(
                  (sentence: SentenceDescription, index: number) => (
                    <TextWithLink
                      key={index}
                      isFirst={index == 0}
                      clickableRef={clickableRef}
                      setHover={setHover}
                      setDisplayMedia={setDisplayMedia}
                      {...sentence} // content, isLink and url
                    />
                  )
                )}
              </JobDescriptionText>
            );
          }
        )}
        <JobDescriptionText isFirst={false}>
          - <span style={{ color: COLOR.RED }}>Tech stack</span>:
          {experience.techStack.map(
            (tech: string, index: number) =>
              `${index == 0 ? " " : " • "}${tech}`
          )}
        </JobDescriptionText>
        {useBreakpoint(up("md")) && experience.isMedia && (
          <CSSTransition
            nodeRef={mediaRef}
            in={displayMedia}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Media ref={mediaRef} position={clickableRef}>
              <Video autoPlay loop muted>
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
    margin-bottom: ${({ height }: { height: number }) =>
      30 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const JobTitle = styled.p`
  font-size: 22px;
  color: ${COLOR.RED};

  ${up("xxxl")} {
    font-size: 24px;
  }
`;

const Company = styled.p`
  font-size: 22px;

  ${up("xxxl")} {
    font-size: 24px;
  }
`;

const Secondary = styled.p`
  font-size: 16px;

  ${up("xxxl")} {
    font-size: 18px;
  }
`;

const JobDescriptionText = styled.p`
  margin-top: ${({ isFirst }: { isFirst: boolean }) =>
    isFirst ? "25px" : "20px"};
  font-size: 18px;
  line-height: 25px;

  ${up("md")} {
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  ${up("xxxl")} {
    margin-top: ${({ isFirst }: { isFirst: boolean }) =>
      isFirst ? "40px" : "20px"};
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
    font-size: 20px;
    line-height: 30px;
  }
`;

const Media = styled.span`
  position: absolute;
  width: calc(100vw - 2 * 10px);
  height: auto;
  margin-top: -63vw;
  z-index: 99999 !important;

  ${up("md")} {
    width: 360px;
    height: 210px;
    margin-top: 0;
    margin-left: 90px;
    top: ${({ position }: { position: React.RefObject<HTMLAnchorElement> }) =>
      position?.current?.getBoundingClientRect().top! -
      MEDIA_TOP_OFFSET +
      "px"};
  }

  ${up("xxxl")} {
    width: 385px;
    height: 225px;
    margin-left: 100px;
    top: ${({ position }: { position: React.RefObject<HTMLAnchorElement> }) =>
      position?.current?.getBoundingClientRect().top! -
      MEDIA_TOP_OFFSET_DESKTOP +
      "px"};
  }
`;

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  z-index: 99999 !important;
  transform: translate(-50%, -50%);
  background-color: ${COLOR.BACKGROUND_BLACK_SECONDARY};
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
    0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;
