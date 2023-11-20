import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { COLOR } from "../../styles/theme";

const Loading = () => {
  return (
    <Container
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.7 }}
    ></Container>
  );
};

export default Loading;

const Container = styled(motion.div)`
  width: 30px;
  height: 30px;
  clear: both;

  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;

  position: absolute;
  border: 2px ${COLOR.BLACK} solid;
  border-radius: 50%;
  -webkit-animation: spHydro 1s infinite linear;
  animation: spHydro 1s infinite linear;

  &:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    top: -1px;
    left: -1px;
    background-color: ${COLOR.BLACK};
    border-radius: 50%;
  }

  @-webkit-keyframes spHydro {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(359deg);
    }
  }
  @keyframes spHydro {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;
