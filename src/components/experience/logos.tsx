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
        duration: 0.4,
        delay: 0.2,
      }}
    >
      <QantasLogo>
        <img src={qantas} alt="Qantas" />
      </QantasLogo>
      <NzGovtLogo>
        <img src={nzgovt} alt="New Zealand Government" />
      </NzGovtLogo>
      <UsydLogo>
        <img src={usyd} alt="University of Sydney" />
      </UsydLogo>
      <UoaLogo>
        <img src={uoa} alt="University of Auckland" />
      </UoaLogo>
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
    margin-top: 4vw;
    margin-bottom: 4vw;
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

const QantasLogo = styled(Logo)`
  border-bottom: 0.5px solid ${COLOR.BORDER_WHITE};

  ${up("sm")} {
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
  border-bottom: 0.5px solid ${COLOR.BORDER_WHITE};

  ${up("sm")} {
    border-bottom: 0;
    border-right: 0.5px solid ${COLOR.BORDER_WHITE};
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

const UsydLogo = styled(Logo)`
  border-bottom: 0.5px solid ${COLOR.BORDER_WHITE};

  ${up("sm")} {
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

const UoaLogo = styled(Logo)`
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
