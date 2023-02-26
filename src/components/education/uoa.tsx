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

const Uoa = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Container className="font-primary-normal">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.4 + 0.3 * 3,
        }}
      >
        <Logo
          height={55}
          src={iconPicker("uoa", isDarkMode)}
          alt="University of Auckland"
        />
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
        <img
          className="mt-8 mb-2 h-4 w-auto"
          src={iconPicker("redbull", isDarkMode)}
          alt="Red Bull"
        />
        <SecondaryTitle isDarkMode={isDarkMode}>
          President of the University of Auckland Motorsport Club
        </SecondaryTitle>
        <p className="text-base xxxl:text-lg">
          - Sponsored by Red Bull, we thrive to create entertainment for busy
          University life as well as promote Safe Driving
        </p>
        <img
          className="mt-5 mb-2 h-5 w-auto"
          src={iconPicker("cie", isDarkMode)}
          alt="CIE"
        />
        <SecondaryTitle isDarkMode={isDarkMode}>
          University of Auckland Centre for Innovation and Entrepreneurship
        </SecondaryTitle>
        <p className="text-base xxxl:text-lg">
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

const SecondaryTitle = styled.p`
  font-size: 18px;
  line-height: 28px;
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BLUE : COLOR.RED};

  ${up("xxxl")} {
    font-size: 20px;
    line-height: 28px;
  }
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
