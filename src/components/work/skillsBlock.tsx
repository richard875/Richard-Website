import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import size from "../../styles/layout";
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
} from "../../constants/margin";

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
        className="!ml-1 !mb-0"
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
        transition={{ stiffness: 0, duration: 0.4, delay: 0.1 }}
      >
        <Logo
          className="hidden xxxl:block"
          height={50}
          src={iconPicker("react", isDarkMode)}
          alt={"My Skills"}
        />
        <TitleWrapper>
          <Title>Proficient Skills</Title>
          <Logo
            className="xxxl:hidden"
            height={30}
            style={{ paddingBottom: "5px" }}
            src={iconPicker("react", isDarkMode)}
            alt={"My Skills"}
          />
        </TitleWrapper>
        {(skillsData as Skills).primary.map(
          (skill: SkillType, index: number) => (
            <Skill key={index}>
              <SkillsTextWrapper>
                <SkillsText isTitle={false}>
                  <span className="md:hidden"> - </span>
                  {skill.displayName}
                </SkillsText>
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
                  delay: 0.4,
                }}
              ></SkillsBar>
            </Skill>
          )
        )}
        <Skill>
          <SkillsText isTitle={true} className="pt-1">
            Familiar Skills
          </SkillsText>
        </Skill>
        <SecondarySkillsWrapper>
          {(skillsData as Skills).secondary
            .slice(0, 8)
            .map((skill: SkillType, index: number) => (
              <SecondarySkills
                key={index}
                skill={skill}
                isDarkMode={isDarkMode}
              />
            ))}
          <SecondarySkills
            skill={(skillsData as Skills).secondary[8]}
            isDarkMode={isDarkMode}
          />
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

  @media ${size.up.md} {
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

  @media ${size.up.xxxl} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  @media ${size.up.md} {
    margin-bottom: -10px;
  }
`;

const Logo = styled.img`
  height: ${({ height }: { height: number }) => height + "px"};
  width: auto;
  user-select: none;
  margin-left: 8px;

  @media ${size.up.xxxl} {
    margin-top: ${({ height }: { height: number }) =>
      10 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
    margin-bottom: ${({ height }: { height: number }) =>
      15 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const Title = styled.p`
  font-size: 23px;

  @media ${size.up.xxxl} {
    font-size: 25px;
  }
`;

const Skill = styled.div`
  margin-top: 15px;

  @media ${size.up.md} {
    margin-top: 20px;
  }

  @media ${size.up.xxxl} {
    margin-top: 27px;
  }
`;

const SkillsTextWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SkillsText = styled.p`
  font-size: ${({ isTitle }: { isTitle: boolean }) =>
    isTitle ? "22px" : "18px"};

  @media ${size.up.xxxl} {
    font-size: ${({ isTitle }: { isTitle: boolean }) =>
      isTitle ? "24px" : "20px"};
  }
`;

const SkillsImage = styled.img`
  height: 20px;
  width: auto;
  margin-left: 10px;
  margin-bottom: 4px;
  user-select: none;

  @media ${size.up.sm} {
    margin-bottom: 3px;
  }

  @media ${size.up.xxxl} {
    height: 23px;
  }
`;

const SkillsBar = styled(motion.div)`
  height: 4px;
  background-color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BLUE : COLOR.RED};
  display: none;

  @media ${size.up.md} {
    display: block;
  }
`;

const SecondarySkillsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 10px;

  @media ${size.up.sm} {
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

  @media ${size.down.sm} {
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

  @media ${size.up.sm} {
    &:nth-child(n + 5) {
      border-top: ${({ isDarkMode }: { isDarkMode: boolean }) =>
        isDarkMode
          ? `0.5px solid ${COLOR.BORDER_WHITE}`
          : `0.5px solid ${COLOR.BORDER_BLACK}`};
    }

    &:nth-child(4n + 1) {
      border-left: none;
    }

    &:last-of-type {
      display: none;
    }
  }
`;

const SecondarySkillsText = styled.div`
  font-size: 16px;
  padding-top: 4px;
  margin-right: 4px;
`;
