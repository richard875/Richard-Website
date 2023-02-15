import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { COLOR } from "../../styles/theme";
import iconPicker from "../../helper/iconPicker";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/workPage";

const Uoa = ({ index, isDarkMode }: { index: number; isDarkMode: boolean }) => {
  return (
    <Container className="font-primary-normal">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.4 + 0.3 * (index + 2),
        }}
      >
        <Logo height={55} src={iconPicker("uoa", isDarkMode)} alt={"uoa"} />
        <UniversityText isDarkMode={isDarkMode}>
          The University of Auckland
        </UniversityText>
        <p className="mt-1 text-lg xxxl:text-xl">
          Bachelor of Science | Computer Science
        </p>
        <SummaryText>
          • Achieved excellent grades in Computer Science and Mathematics
          courses, including Algorithms and Data Structures, OOP, DBMS
          Architecture and discrete mathematics
        </SummaryText>
        <SummaryText>
          • Class representative for the Computer Science department
        </SummaryText>
        <SubtitleText isDarkMode={isDarkMode}>Extracurricular</SubtitleText>
        <div className="mt-4 flex items-center">
          <p className="pt-1 text-lg xxxl:text-xl">
            President of the University of Auckland Motorsport Club
          </p>
          <img
            className="h-4 xxxl:h-5 w-auto ml-2.5"
            src={iconPicker("redbull", isDarkMode)}
          />
        </div>
        <p className="mt-2 text-base xxxl:text-lg">
          - Sponsored by Red Bull, we thrive to create entertainment for busy
          University life as well as promote Safe Driving
        </p>
        <div className="mt-6 flex items-center">
          <p className="text-lg xxxl:text-xl">
            University of Auckland Centre for Innovation and Entrepreneurship
          </p>
          <img
            className="h-5 xxxl:h-6 w-auto ml-2.5"
            src={iconPicker("cie", isDarkMode)}
          />
        </div>
        <p className="mt-2 text-base xxxl:text-lg">
          - Hosted and facilitated fortnightly innovation seminars as the Master
          of Ceremonies, guiding discussions and encouraging participation among
          attendees
        </p>
      </motion.div>
    </Container>
  );
};

export default Uoa;

const Container = styled.div`
  margin-top: 30px;
  padding-bottom: 10px;
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};

  ${up("md")} {
    flex: auto;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
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

const UniversityText = styled.p`
  font-size: 22px;
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BLUE : COLOR.RED};

  ${up("xxxl")} {
    font-size: 24px;
  }
`;

const SubtitleText = styled(UniversityText)`
  margin-top: 35px;
  font-size: 22px;
`;

const SummaryText = styled.p`
  margin-top: 15px;
  font-size: 18px;
  line-height: 25px;

  ${up("md")} {
    width: 90%;
  }

  ${up("xxxl")} {
    font-size: 20px;
    line-height: 30px;
  }
`;
