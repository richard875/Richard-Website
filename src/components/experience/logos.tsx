import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Icon from "../../enums/icons";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import iconPicker from "../../helper/iconPicker";

const borderColor = (isDarkMode: boolean) =>
  isDarkMode ? Color.BORDER_WHITE : Color.BORDER_BLACK;

const Logos = ({
  delay = 0.2,
  isDarkMode = false,
}: {
  delay?: number;
  isDarkMode?: boolean;
}) => (
  <Container
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ stiffness: 0, duration: 0.3, delay }}
  >
    <FdjLogo $isDarkMode={isDarkMode}>
      <img src={iconPicker(Icon.FdjUnited, isDarkMode)} alt="FDJ United" />
    </FdjLogo>
    <QantasLogo $isDarkMode={isDarkMode}>
      <img src={iconPicker(Icon.Qantas, isDarkMode)} alt="Qantas" />
    </QantasLogo>
    <CoatesLogo $isDarkMode={isDarkMode}>
      <img src={iconPicker(Icon.Coates, isDarkMode)} alt="Coates Group" />
    </CoatesLogo>
    <UsydLogo $isDarkMode={isDarkMode}>
      <img src={iconPicker(Icon.USYD, isDarkMode)} alt="University of Sydney" />
    </UsydLogo>
  </Container>
);

export default Logos;

const Container = styled(motion.div)`
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 1fr);
  grid-auto-rows: minmax(100px, auto);
  user-select: none;

  @media ${layout.up.sm} {
    margin-top: 4vw;
    margin-bottom: 4vw;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
  }

  @media ${layout.up.lg} {
    margin-top: 2vw;
    margin-bottom: 2vw;
  }
`;

const Logo = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${layout.down.sm} {
    height: 35vw !important;
  }

  @media ${layout.up.sm} {
    height: 10vw !important;
  }

  @media ${layout.up.lg} {
    height: 5.5vw !important;
  }
`;

const FdjLogo = styled(Logo)`
  border-bottom: 0.5px solid ${({ $isDarkMode }) => borderColor($isDarkMode)};

  @media ${layout.up.sm} {
    border-bottom: 0;
    border-right: 0.5px solid ${({ $isDarkMode }) => borderColor($isDarkMode)};
  }

  img {
    height: 6vw;

    @media ${layout.up.sm} {
      height: 2.3vw;
    }

    @media ${layout.up.lg} {
      height: 1.3vw;
    }
  }
`;

const QantasLogo = styled(Logo)`
  border-bottom: 0.5px solid ${({ $isDarkMode }) => borderColor($isDarkMode)};

  @media ${layout.up.sm} {
    border-bottom: 0;
    border-right: 0.5px solid ${({ $isDarkMode }) => borderColor($isDarkMode)};
  }

  img {
    height: 8vw;

    @media ${layout.up.sm} {
      height: 3vw;
    }

    @media ${layout.up.lg} {
      height: 1.7vw;
    }
  }
`;

const CoatesLogo = styled(Logo)`
  border-bottom: 0.5px solid ${({ $isDarkMode }) => borderColor($isDarkMode)};

  @media ${layout.up.sm} {
    border-bottom: 0;
    border-right: 0.5px solid ${({ $isDarkMode }) => borderColor($isDarkMode)};
  }

  img {
    height: 8vw;

    @media ${layout.up.sm} {
      height: 3.5vw;
    }

    @media ${layout.up.lg} {
      height: 1.8vw;
    }
  }
`;

const UsydLogo = styled(Logo)`
  img {
    height: 11vw;

    @media ${layout.up.sm} {
      height: 4.5vw;
    }

    @media ${layout.up.lg} {
      height: 2.5vw;
    }
  }
`;
