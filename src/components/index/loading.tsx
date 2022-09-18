import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { COLOR } from "../../styles/theme";

const Loading = () => {
  return (
    <Container
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 0,
      }}
      transition={{
        delay: 1.2,
      }}
    ></Container>
  );
};

export default Loading;

const Container = styled(motion.div)`
  width: 30px;
  height: 30px;
  clear: both;
  top: 52%;
  margin: 0 auto;

  position: absolute;
  border: 2px ${COLOR.BLACK} solid;
  border-radius: 50%;
  -webkit-animation: spHydro 1s infinite linear;
  animation: spHydro 1s infinite linear;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${COLOR.BLACK};
    border-radius: 50%;
  }

  &:before {
    top: calc(50% - 4px);
    left: calc(50% - 4px);
  }

  &:after {
    top: -1px;
    left: -1px;
  }

  @-webkit-keyframes spHydro {
    from {
      -webkit-transform: rotate(0deg) scale(0.45);
    }
    to {
      -webkit-transform: rotate(359deg) scale(0.45);
    }
  }
  @keyframes spHydro {
    from {
      transform: rotate(0deg) scale(0.45);
    }
    to {
      transform: rotate(359deg) scale(0.45);
    }
  }
`;
