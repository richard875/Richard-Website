import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const InitialTransition = ({ color }: { color: string }) => {
  React.useEffect(() => {
    document.body.style.backgroundColor = color;
  }, []);

  return (
    <Transition
      color={color}
      initial={{ bottom: 0, height: "0px" }}
      exit={{ height: "100vh" }}
      transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
    ></Transition>
  );
};

export default InitialTransition;

const Transition = styled(motion.div)`
  width: 100vw;
  position: absolute;
  z-index: 99999;
  background-color: ${(props: any) => props.color};
`;
