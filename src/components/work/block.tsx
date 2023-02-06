import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { COLOR } from "../../styles/theme";
import iconPicker from "../../helper/iconPicker";
import TextWithLink from "../../components/work/textWithLink";
import WorkExperience, { JobDescription } from "../../types/workExperience";
import workData from "../../../static/data/work.json";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
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
          (description: JobDescription[], index: number) => {
            return (
              <JobDescriptionText key={index} isFirst={index == 0}>
                {description.map((sentence: JobDescription, index: number) => (
                  <TextWithLink
                    key={index}
                    isFirst={index == 0}
                    setHover={setHover}
                    {...sentence} // content, isLink and url
                  />
                ))}
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
