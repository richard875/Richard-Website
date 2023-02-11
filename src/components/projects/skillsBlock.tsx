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

const SkillsBlock = () => {
  return (
    <Container className="font-primary-normal">
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
            src={iconPicker("react", false)}
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
              src={iconPicker("react", false)}
              alt={"My Skills"}
            />
          )}
        </TitleWrapper>

        {(skillsData as Skills).primary.map(
          (skill: SkillType, index: number) => (
            <Skill key={index}>
              <SkillsTextWrapper>
                <SkillsText>{skill.displayName}</SkillsText>
                <SkillsImage src={iconPicker(skill.name, false)}></SkillsImage>
              </SkillsTextWrapper>
              <SkillsBar
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
        <div className="flex items-center mt-2.5">
          {(skillsData as Skills).secondary
            .slice(0, 4)
            .map((skill: SkillType, index: number) => (
              <>
                <SkillsTextWrapper className="!mb-0" key={index}>
                  <SkillsText className="text-base pt-0.5">
                    {index != 0 && <>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;</>}
                    {skill.displayName}
                  </SkillsText>
                  <SkillsImage
                    className="ml-2"
                    src={iconPicker(skill.name, false)}
                  ></SkillsImage>
                </SkillsTextWrapper>
              </>
            ))}
        </div>
        <div className="flex items-center mt-2">
          {(skillsData as Skills).secondary
            .slice(4)
            .map((skill: SkillType, index: number) => (
              <>
                <SkillsTextWrapper className="!mb-0" key={index}>
                  <SkillsText className="text-base pt-0.5">
                    {index != 0 && <>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;</>}
                    {skill.displayName}
                  </SkillsText>
                  <SkillsImage
                    className="ml-2"
                    src={iconPicker(skill.name, false)}
                  ></SkillsImage>
                </SkillsTextWrapper>
              </>
            ))}
        </div>
      </motion.div>
    </Container>
  );
};

export default SkillsBlock;

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
    border-right: 0.5px solid ${COLOR.BACKGROUND_BLACK_SECONDARY};
  }

  ${up("xxxl")} {
    width: ${BLOCK_WIDTH_DESKTOP + "px"};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;

  ${up("xxxl")} {
    margin-top: 0;
  }
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
  background-color: ${COLOR.RED};
`;
