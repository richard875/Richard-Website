import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
import uoa from "../../../static/images/logos/uoa.png";
import usyd from "../../../static/images/logos/usyd.svg";
import qantas from "../../../static/images/logos/qantas.svg";
import nzgovt from "../../../static/images/logos/nzgovt.png";
import { COLOR } from "../../styles/theme";

const Logos = () => {
  return (
    <Container
      className="select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        stiffness: 0,
        duration: 1,
        delay: 1.2,
      }}
    >
      <UoaLogo>
        <img src={uoa} alt="University of Auckland" />
      </UoaLogo>
      <UsydLogo>
        <img src={usyd} alt="University of Sydney" />
      </UsydLogo>
      <QantasLogo>
        <img src={qantas} alt="Qantas" />
      </QantasLogo>
      <NzGovtLogo>
        <img src={nzgovt} alt="New Zealand Government" />
      </NzGovtLogo>
    </Container>
  );
};

export default Logos;

const Container = styled(motion.div)`
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 1fr);
  grid-auto-rows: minmax(100px, auto);

  ${up("sm")} {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    margin-top: 5vw;
    margin-bottom: 5vw;
  }

  ${up("lg")} {
    margin-top: 2vw;
    margin-bottom: 2vw;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${down("sm")} {
    height: 35vw !important;
  }

  ${up("sm")} {
    height: 10vw !important;
  }

  ${up("lg")} {
    height: 5.5vw !important;
  }
`;

const UoaLogo = styled(Logo)`
  grid-column: 1;
  grid-row: 4;

  ${up("sm")} {
    grid-column: 1;
    grid-row: 1;
    border-right: 0.5px solid ${COLOR.BORDER_WHITE};
  }

  img {
    height: 13vw;

    ${up("sm")} {
      height: 5vw;
    }

    ${up("lg")} {
      height: 2.6vw;
    }
  }
`;

const UsydLogo = styled(Logo)`
  grid-column: 1;
  grid-row: 3;
  border-bottom: 0.5px solid ${COLOR.BORDER_WHITE};

  ${up("sm")} {
    grid-column: 2;
    grid-row: 1;
    border-bottom: 0;
    border-right: 0.5px solid ${COLOR.BORDER_WHITE};
  }

  img {
    height: 11vw;

    ${up("sm")} {
      height: 4.5vw;
    }

    ${up("lg")} {
      height: 2.5vw;
    }
  }
`;

const QantasLogo = styled(Logo)`
  grid-column: 1;
  grid-row: 1;
  border-bottom: 0.5px solid ${COLOR.BORDER_WHITE};

  ${up("sm")} {
    grid-column: 3;
    grid-row: 1;
    border-bottom: 0;
    border-right: 0.5px solid ${COLOR.BORDER_WHITE};
  }

  img {
    height: 8vw;

    ${up("sm")} {
      height: 3vw;
    }

    ${up("lg")} {
      height: 1.7vw;
    }
  }
`;

const NzGovtLogo = styled(Logo)`
  grid-column: 1;
  grid-row: 2;
  border-bottom: 0.5px solid ${COLOR.BORDER_WHITE};

  ${up("sm")} {
    grid-column: 4;
    grid-row: 1;
    border-bottom: 0;
  }

  img {
    height: 10vw;

    ${up("sm")} {
      height: 4.5vw;
    }

    ${up("lg")} {
      height: 2.5vw;
    }
  }
`;
