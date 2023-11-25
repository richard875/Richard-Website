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

const Usyd = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Container className="font-primary-normal" isDarkMode={isDarkMode}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 0.4,
          delay: 0.1 * 2,
        }}
      >
        <Logo
          height={50}
          src={iconPicker("usyd", isDarkMode)}
          alt="University of Sydney"
        />
        <UniversityText isDarkMode={isDarkMode}>
          The University of Sydney
        </UniversityText>
        <p className="mt-1 text-lg xxxl:text-xl">
          Bachelor of Science (Honours) | Computer Science
        </p>
        <SummaryText>
          • Achieved excellent grades in Computer Science and Mathematics
          courses, including Algorithms and Data Structures, OOP, DBMS
          Architecture and discrete mathematics
        </SummaryText>
        <p
          style={{ color: isDarkMode ? COLOR.BLUE : COLOR.RED }}
          className="mt-8 text-lg xxxl:text-xl"
        >
          Academic Experience
        </p>
        <p className="mt-2 text-base xxxl:text-lg">
          - Achieved excellent grades in Computer Science and Mathematics
          courses, including Algorithms and Data Structures, OOP, DBMS
          Architecture and discrete mathematics
        </p>
        <p className="mt-2 text-base xxxl:text-lg">
          - Achieved excellent grades in Computer Science and Mathematics
          courses, including Algorithms and Data Structures, OOP, DBMS
          Architecture and discrete mathematics
        </p>
      </motion.div>
    </Container>
  );
};

export default Usyd;

const Container = styled.div`
  margin-top: 20px;
  padding-bottom: 10px;
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};
  border-right: none;

  ${up("md")} {
    flex: auto;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
    border-right: ${({ isDarkMode }: { isDarkMode: boolean }) =>
      isDarkMode
        ? `0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY}`
        : `0.5px solid ${COLOR.BACKGROUND_BLACK}`};
  }
`;

const Logo = styled.img`
  height: ${({ height }: { height: number }) => height + "px"};
  width: auto;
  margin-top: ${({ height }: { height: number }) =>
    15 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  margin-bottom: ${({ height }: { height: number }) =>
    15 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  user-select: none;

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
