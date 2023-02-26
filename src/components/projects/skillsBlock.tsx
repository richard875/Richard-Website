import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { COLOR } from "../../styles/theme";
import skillsData from "../../../static/data/skills.json";
import iconPicker from "../../helper/iconPicker";
import Skills, { Skill as SkillType } from "../../types/skills";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/workPage";

const SecondarySkills = ({
  skill,
  isDarkMode,
}: {
  skill: SkillType;
  isDarkMode: boolean;
}) => {
  return (
    <SecondarySkillsItem isDarkMode={isDarkMode}>
      <SecondarySkillsText>{skill.displayName}</SecondarySkillsText>
      <SkillsImage
        className="!ml-1"
        src={iconPicker(skill.name, isDarkMode)}
        alt={skill.displayName}
      ></SkillsImage>
    </SecondarySkillsItem>
  );
};

const SkillsBlock = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Container className="font-primary-normal" isDarkMode={isDarkMode}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 1,
        }}
      >
        {useBreakpoint(up("xxxl")) && (
          <Logo
            height={50}
            src={iconPicker("react", isDarkMode)}
            alt={"My Skills"}
          />
        )}

        <TitleWrapper>
          <Title>My Skills</Title>
          {useBreakpoint(down("xxxl")) && (
            <Logo
              height={30}
              className="ml-2"
              style={{ paddingBottom: "5px" }}
              src={iconPicker("react", isDarkMode)}
              alt={"My Skills"}
            />
          )}
        </TitleWrapper>

        {(skillsData as Skills).primary.map(
          (skill: SkillType, index: number) => (
            <Skill key={index}>
              <SkillsTextWrapper>
                <SkillsText className="pt-1">{skill.displayName}</SkillsText>
                <SkillsImage
                  src={iconPicker(skill.name, isDarkMode)}
                  alt={skill.displayName}
                ></SkillsImage>
              </SkillsTextWrapper>
              <SkillsBar
                isDarkMode={isDarkMode}
                initial={{ width: 0 }}
                animate={{ width: skill.skill! + "%" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 35,
                  mass: 1,
                  delay: 1.7,
                }}
              ></SkillsBar>
            </Skill>
          )
        )}
        <Skill>
          <SkillsText className="pt-1">Other:</SkillsText>
        </Skill>
        <SecondarySkillsWrapper>
          {(skillsData as Skills).secondary
            .slice(0, useBreakpoint(up("sm")) ? 8 : 9)
            .map((skill: SkillType, index: number) => (
              <SecondarySkills
                key={index}
                skill={skill}
                isDarkMode={isDarkMode}
              />
            ))}
        </SecondarySkillsWrapper>
      </motion.div>
    </Container>
  );
};

export default SkillsBlock;

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};
  border-right: none;

  ${up("md")} {
    padding-top: 0;
    padding-bottom: 0;
    width: ${BLOCK_WIDTH + "px"};
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
    border-right: ${({ isDarkMode }: { isDarkMode: boolean }) =>
      isDarkMode
        ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
        : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};
  }

  ${up("xxxl")} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: ${({ height }: { height: number }) => height + "px"};
  width: auto;

  ${up("xxxl")} {
    margin-top: ${({ height }: { height: number }) =>
      10 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
    margin-bottom: ${({ height }: { height: number }) =>
      15 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const Title = styled.p`
  font-size: 23px;

  ${up("xxxl")} {
    font-size: 25px;
  }
`;

const Skill = styled.div`
  margin-top: 20px;

  ${up("xxxl")} {
    margin-top: 30px;
  }
`;

const SkillsTextWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SkillsText = styled.p`
  font-size: 18px;

  ${up("xxxl")} {
    font-size: 20px;
  }
`;

const SkillsImage = styled.img`
  height: 20px;
  width: auto;
  margin-left: 10px;

  ${up("xxxl")} {
    height: 23px;
  }
`;

const SkillsBar = styled(motion.div)`
  height: 4px;
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BLUE : COLOR.RED};
`;

const SecondarySkillsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 10px;

  ${up("sm")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const SecondarySkillsItem = styled.div`
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode
      ? `0.5px solid ${COLOR.BORDER_WHITE}`
      : `0.5px solid ${COLOR.BORDER_BLACK}`};

  ${down("sm")} {
    &:nth-child(n + 4) {
      border-top: ${({ isDarkMode }: { isDarkMode: boolean }) =>
        isDarkMode
          ? `0.5px solid ${COLOR.BORDER_WHITE}`
          : `0.5px solid ${COLOR.BORDER_BLACK}`};
    }

    &:nth-child(3n + 1) {
      border-left: none;
    }
  }

  ${up("sm")} {
    &:nth-child(n + 5) {
      border-top: ${({ isDarkMode }: { isDarkMode: boolean }) =>
        isDarkMode
          ? `0.5px solid ${COLOR.BORDER_WHITE}`
          : `0.5px solid ${COLOR.BORDER_BLACK}`};
    }

    &:nth-child(4n + 1) {
      border-left: none;
    }
  }
`;

const SecondarySkillsText = styled.div`
  font-size: 16px;
  padding-top: 4px;
  margin-right: 4px;
`;
