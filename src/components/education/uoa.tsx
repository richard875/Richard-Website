import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import layout from "../../styles/layout";
import { COLOR } from "../../styles/theme";
import iconPicker from "../../helper/iconPicker";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/margin";

const Uoa = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Container className="font-primary-normal">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ stiffness: 0, duration: 0.4, delay: 0.1 * 3 }}
      >
        <Logo
          $height={55}
          src={iconPicker("uoa", isDarkMode)}
          alt="University of Auckland"
        />
        <UniversityText $isDarkMode={isDarkMode}>
          The University of Auckland
        </UniversityText>
        <p className="mt-1 mb-9 text-lg xxxl:text-xl">
          Bachelor of Science | Computer Science
        </p>
        <SummaryText>
          • Attained exemplary academic performance in Computer Science and
          Mathematics disciplines, excelling in coursework encompassing
          <Highlight $isDarkMode={isDarkMode}>
            &nbsp;Algorithms and Data Structures
          </Highlight>
          ,
          <Highlight $isDarkMode={isDarkMode}>
            &nbsp;Object-Oriented Programming (OOP)
          </Highlight>
          ,
          <Highlight $isDarkMode={isDarkMode}>
            &nbsp;Database Management System (DBMS) Architecture
          </Highlight>
          , and
          <Highlight $isDarkMode={isDarkMode}>
            &nbsp;Discrete Mathematics
          </Highlight>
          .
        </SummaryText>
        <SummaryText>
          • I served as the appointed
          <Highlight $isDarkMode={isDarkMode}>
            &nbsp;class representative&nbsp;
          </Highlight>
          for the Computer Science department, demonstrating
          <Highlight $isDarkMode={isDarkMode}>&nbsp;leadership&nbsp;</Highlight>
          and
          <Highlight $isDarkMode={isDarkMode}>
            &nbsp;effective communication&nbsp;
          </Highlight>
          skills.
        </SummaryText>
        <img
          className="mt-8 mb-2 h-4 w-auto select-none"
          src={iconPicker("redbull", isDarkMode)}
          alt="Red Bull"
        />
        <SecondaryTitle $isDarkMode={isDarkMode}>
          President of the University of Auckland Motorsport Club
        </SecondaryTitle>
        <p className="text-base xxxl:text-lg">
          - <Highlight $isDarkMode={isDarkMode}>Founded</Highlight> the
          University of Auckland Motorsport Club with around
          <Highlight $isDarkMode={isDarkMode}>&nbsp;800</Highlight> Members.
        </p>
        <p className="text-base xxxl:text-lg">
          - Led initiatives in partnership with
          <Highlight $isDarkMode={isDarkMode}>&nbsp;Red Bull</Highlight>,
          promoting both entertainment options for the active University
          community and advocating for&nbsp;
          <Highlight $isDarkMode={isDarkMode}>Safe Driving Practices</Highlight>
          .
        </p>
        <img
          className="mt-5 mb-2 h-5 w-auto select-none"
          src={iconPicker("cie", isDarkMode)}
          alt="CIE"
        />
        <SecondaryTitle $isDarkMode={isDarkMode}>
          University of Auckland Centre for Innovation and Entrepreneurship
        </SecondaryTitle>
        <p className="text-base xxxl:text-lg">
          - Directed and Hosted fortnightly innovation seminars as the&nbsp;
          <Highlight $isDarkMode={isDarkMode}>Master of Ceremonies</Highlight>,
          adeptly guiding discussions and encouraging active engagement among
          participants to drive&nbsp;
          <Highlight $isDarkMode={isDarkMode}>collaborative ideation</Highlight>
          .
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

  @media ${layout.up.md} {
    flex: 0.5;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: ${BLOCK_PADDING_DESKTOP + "px"};
    padding-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Logo = styled.img<{ $height: number }>`
  height: ${({ $height }) => $height + "px"};
  width: auto;
  margin-top: ${({ $height }) =>
    15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  margin-bottom: ${({ $height }) =>
    15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  user-select: none;

  @media ${layout.up.md} {
    margin-top: ${({ $height }) =>
      10 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
    margin-bottom: ${({ $height }) =>
      30 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;

const UniversityText = styled.p<{ $isDarkMode: boolean }>`
  font-size: 22px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.BLUE : COLOR.RED)};

  @media ${layout.up.xxxl} {
    font-size: 24px;
  }
`;

const SecondaryTitle = styled.p<{ $isDarkMode: boolean }>`
  font-size: 18px;
  line-height: 28px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.BLUE : COLOR.RED)};

  @media ${layout.up.xxxl} {
    font-size: 20px;
    line-height: 28px;
  }
`;

const SummaryText = styled.p`
  margin-top: 15px;
  font-size: 18px;
  line-height: 25px;

  @media ${layout.up.md} {
    width: 90%;
  }

  @media ${layout.up.xxxl} {
    font-size: 20px;
    line-height: 30px;
  }
`;

const Highlight = styled.span<{ $isDarkMode: boolean }>`
  color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.BLUE : COLOR.RED)};
`;
