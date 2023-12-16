import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { COLOR } from "../../styles/theme";
import iconPicker from "../../helper/iconPicker";
import {
  BLOCK_PADDING,
  BLOCK_PADDING_DESKTOP,
  IMAGE_DEFAULT_HEIGHT,
} from "../../constants/margin";

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
        <p className="mt-1 mb-9 text-lg xxxl:text-xl">
          Bachelor of Science (Honours) | Computer Science
        </p>
        <SummaryText>
          • I conducted extensive research and authored an
          <Highlight isDarkMode={isDarkMode}>&nbsp;Honours Thesis</Highlight> at
          the University of Sydney titled
          <Highlight isDarkMode={isDarkMode}>
            &nbsp;"Performance Gap: Traditional VM Containers vs. Serverless
            WebAssembly Frameworks on the Edge"
          </Highlight>
          . This comprehensive study delved into performance disparities while
          also exploring the utilisation of
          <Highlight isDarkMode={isDarkMode}>
            &nbsp;WebAssembly in web browsers
          </Highlight>
          , enabling functionalities previously deemed unattainable. The
          findings offered valuable insights into optimising software execution
          within <Highlight isDarkMode={isDarkMode}>edge computing</Highlight>,
          addressing pivotal benchmarks in modern Software Engineering
          paradigms.
        </SummaryText>
        <SummaryText>
          •{" "}
          <Highlight isDarkMode={isDarkMode}>
            Research Interests:&nbsp;
          </Highlight>
          WebAssembly, Edge Computing, Serverless Computing, Virtual Machine
          Containerisation.
        </SummaryText>
        <p
          style={{ color: isDarkMode ? COLOR.BLUE : COLOR.RED }}
          className="mt-8 text-lg xxxl:text-xl"
        >
          Academic Experience
        </p>
        <p className="mt-2 text-base xxxl:text-lg">
          - Employed as an
          <Highlight isDarkMode={isDarkMode}>
            &nbsp;Academic Teaching Assistant&nbsp;
          </Highlight>
          for SOFT2412 -
          <Highlight isDarkMode={isDarkMode}>
            &nbsp;Agile Software Development Practices (Java)
          </Highlight>
          , demonstrating expertise in facilitating educational modules within
          an esteemed academic program.
        </p>
        <p className="mt-2 text-base xxxl:text-lg">
          - As an
          <Highlight isDarkMode={isDarkMode}>
            &nbsp;Academic Teaching Assistant
          </Highlight>
          , I guided students through Agile Software Development Practices in
          <Highlight isDarkMode={isDarkMode}>&nbsp;Java</Highlight>, facilitated
          workshops, graded assignments, and collaborated on curriculum
          development to align with industry standards.
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
    flex: 0.5;
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

const Highlight = styled.span`
  color: ${({ isDarkMode }: { isDarkMode: boolean }) =>
    isDarkMode ? COLOR.BLUE : COLOR.RED};
`;
