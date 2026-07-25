import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// `color` is the wipe-mask's own paint colour (the exit animation below),
// not the page's resting background — pages own that via their own
// useLayoutEffect (see useDarkModeManager, contact.tsx, 404.tsx, etc).
// This used to also set `document.body.style.backgroundColor = color` on
// mount, but `color` is each page's *own* useState default for its exit
// transition, which frequently doesn't match that page's actual resting
// background (e.g. contact.tsx defaults it to white despite the page being
// black) — a passive effect, so it landed a frame after paint and stomped
// whatever correct colour routeTo() had already set pre-navigation,
// producing a brief flash of the wrong colour on every page transition.
const InitialTransition = ({ color }: { color: string }) => {
  return (
    <Transition
      color={color}
      initial={{ bottom: 0, height: "0px" }}
      exit={{ height: "100vh" }}
      transition={{
        duration: 0.8,
        ease: [0.87, 0, 0.13, 1] as [number, number, number, number],
      }}
    ></Transition>
  );
};

export default InitialTransition;

const Transition = styled(motion.div)`
  width: 100vw;
  z-index: 99999;
  position: absolute;
  background-color: ${(props: any) => props.color};
`;
