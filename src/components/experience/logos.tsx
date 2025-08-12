import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import usyd from "../../../static/images/logos/usyd.svg";
import qantas from "../../../static/images/logos/qantas.svg";
import coates from "../../../static/images/logos/coates.svg";
import nzgovt from "../../../static/images/logos/nzgovt.png";

const Logos = () => (
  <Container
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
  >
    <QantasLogo>
      <img src={qantas} alt="Qantas" />
    </QantasLogo>
    <CoatesLogo>
      <img src={coates} alt="Coates Group" />
    </CoatesLogo>
    <NzGovtLogo>
      <img src={nzgovt} alt="New Zealand Government" />
    </NzGovtLogo>
    <UsydLogo>
      <img src={usyd} alt="University of Sydney" />
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

const Logo = styled.div`
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

const QantasLogo = styled(Logo)`
  border-bottom: 0.5px solid ${Color.BORDER_WHITE};

  @media ${layout.up.sm} {
    border-bottom: 0;
    border-right: 0.5px solid ${Color.BORDER_WHITE};
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
  border-bottom: 0.5px solid ${Color.BORDER_WHITE};

  @media ${layout.up.sm} {
    border-bottom: 0;
    border-right: 0.5px solid ${Color.BORDER_WHITE};
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

const NzGovtLogo = styled(Logo)`
  border-bottom: 0.5px solid ${Color.BORDER_WHITE};

  @media ${layout.up.sm} {
    border-bottom: 0;
    border-right: 0.5px solid ${Color.BORDER_WHITE};
  }

  img {
    height: 10vw;

    @media ${layout.up.sm} {
      height: 4.5vw;
    }

    @media ${layout.up.lg} {
      height: 2.5vw;
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
