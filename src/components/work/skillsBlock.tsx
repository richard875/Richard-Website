import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Icon from "../../enums/icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import iconPicker from "../../helper/iconPicker";
import getTransitionColor from "../../helper/getTransitionColor";
import skillsData from "../../../static/data/skills.json";
import Skills, { Skill as SkillType } from "../../types/skills";
import RotatingAiSkillsImage, {
  skillsImageStyles,
} from "./rotatingAiSkillsImage";
import SparkleLogo from "./sparkleLogo";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
} from "../../constants/margin";

const SecondarySkills = ({
  skill,
  isDarkMode,
}: {
  skill: SkillType;
  isDarkMode: boolean;
}) => (
  <SecondarySkillsItem $isDarkMode={isDarkMode}>
    <SecondarySkillsText>{skill.displayName}</SecondarySkillsText>
    <SkillsImage
      className="!ml-1 !mb-0"
      src={iconPicker(skill.name, isDarkMode)}
      alt={skill.displayName}
    ></SkillsImage>
  </SecondarySkillsItem>
);

const SkillsBlock = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Container className="font-primary-normal" $isDarkMode={isDarkMode}>
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <SparkleLogo
        className="hidden xxxl:block"
        height={45}
        isDarkMode={isDarkMode}
      />
      <TitleWrapper>
        <Title>Proficient Skills</Title>
        <SparkleLogoWrapper className="xxxl:hidden! pb-1.25">
          <SparkleLogo height={30} isDarkMode={isDarkMode} />
        </SparkleLogoWrapper>
      </TitleWrapper>
      {(skillsData as Skills).primary.map((skill: SkillType, index: number) => (
        <Skill key={index}>
          <SkillsTextWrapper>
            <SkillsText $isTitle={false}>
              <span className="md:hidden"> - </span>
              {skill.displayNameMobile ? (
                <>
                  <span className="hidden md:block">{skill.displayName}</span>
                  <span className="md:hidden">{skill.displayNameMobile}</span>
                </>
              ) : (
                <span>{skill.displayName}</span>
              )}
            </SkillsText>
            {skill.name === Icon.Sparkle ? (
              <RotatingAiSkillsImage
                isDarkMode={isDarkMode}
                alt={skill.displayName}
              />
            ) : (
              <SkillsImage
                src={iconPicker(skill.name, isDarkMode)}
                alt={skill.displayName}
              ></SkillsImage>
            )}
          </SkillsTextWrapper>
          <SkillsBar
            $isDarkMode={isDarkMode}
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
      ))}
      <Skill>
        <SkillsText $isTitle={true} className="pt-1">
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

export default SkillsBlock;

const Container = styled.div<{ $isDarkMode: boolean }>`
  padding-top: 12px;
  padding-bottom: 10px;
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};
  border-right: none;

  @media ${layout.up.md} {
    padding-top: 0;
    padding-bottom: 0;
    width: ${BLOCK_WIDTH + "px"};
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
    border-right: ${({ $isDarkMode }) =>
      `0.5px solid ${getTransitionColor(!$isDarkMode)}`};
  }

  @media ${layout.up.xxxl} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  @media ${layout.up.md} {
    margin-bottom: -10px;
  }
`;

// Padding-bottom lives here rather than on SparkleLogo's own <img> so the
// rotating element's box stays centered on the graphic — padding only on one
// side of the img itself would offset the rotation's pivot point.
const SparkleLogoWrapper = styled.span`
  display: inline-flex;
  align-items: flex-start;
`;

const Title = styled.h2`
  font-size: 23px;

  @media ${layout.up.xxxl} {
    font-size: 25px;
  }
`;

const Skill = styled.div`
  margin-top: 15px;

  @media ${layout.up.md} {
    margin-top: 20px;
  }

  @media ${layout.up.xxxl} {
    margin-top: 27px;
  }
`;

const SkillsTextWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SkillsText = styled.h3<{ $isTitle: boolean }>`
  font-size: ${({ $isTitle }) => ($isTitle ? "22px" : "18px")};

  @media ${layout.up.xxxl} {
    font-size: ${({ $isTitle }) => ($isTitle ? "24px" : "20px")};
  }
`;

const SkillsImage = styled.img`
  ${skillsImageStyles}
`;

const SkillsBar = styled(motion.div)<{ $isDarkMode: boolean }>`
  height: 4px;
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? Color.BLUE : Color.RED};
  display: none;

  @media ${layout.up.md} {
    display: block;
  }
`;

const SecondarySkillsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 10px;

  @media ${layout.up.sm} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const SecondarySkillsItem = styled.div<{ $isDarkMode: boolean }>`
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: ${({ $isDarkMode }) =>
    $isDarkMode
      ? `0.5px solid ${Color.BORDER_WHITE}`
      : `0.5px solid ${Color.BORDER_BLACK}`};

  @media ${layout.down.sm} {
    &:nth-child(n + 4) {
      border-top: ${({ $isDarkMode }) =>
        $isDarkMode
          ? `0.5px solid ${Color.BORDER_WHITE}`
          : `0.5px solid ${Color.BORDER_BLACK}`};
    }

    &:nth-child(3n + 1) {
      border-left: none;
    }
  }

  @media ${layout.up.sm} {
    &:nth-child(n + 5) {
      border-top: ${({ $isDarkMode }) =>
        $isDarkMode
          ? `0.5px solid ${Color.BORDER_WHITE}`
          : `0.5px solid ${Color.BORDER_BLACK}`};
    }

    &:nth-child(4n + 1) {
      border-left: none;
    }

    &:last-of-type {
      display: none;
    }
  }
`;

const SecondarySkillsText = styled.h3`
  font-size: 16px;
  padding-top: 4px;
  margin-right: 4px;
`;
