import React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import Color from "../../enums/color";
import MousePosition from "../../types/mousePosition";
import useIsDesktop from "../../hooks/useIsDesktop";
import useMousePosition from "../../hooks/useMousePosition";

const Cursor = ({
  hover,
  delay,
  position,
  isBlack,
  isIndexPage = false,
}: {
  hover: boolean;
  delay: number;
  position: MousePosition;
  isBlack: boolean;
  isIndexPage?: boolean;
}) => {
  const isDesktop = useIsDesktop();
  const { x, y } = useMousePosition(position);

  const ringRef = React.useRef(null);
  const dotRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 0.2 });
  }, []);

  React.useEffect(() => {
    if (ringRef.current)
      gsap.to(ringRef.current!, { css: { left: x!, top: y! } });
    if (dotRef.current)
      gsap.to(dotRef.current!, { css: { left: x!, top: y! } });
  }, [x, y]);

  return (
    isDesktop && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay }}
      >
        <Ring
          ref={ringRef}
          $hover={hover}
          $black={isBlack}
          $isIndexPage={isIndexPage}
        ></Ring>
        <Dot
          ref={dotRef}
          $hover={hover}
          $black={isBlack}
          $isIndexPage={isIndexPage}
        ></Dot>
      </motion.span>
    )
  );
};

export default Cursor;

const Ring = styled.div<{
  $black: boolean;
  $isIndexPage: boolean;
  $hover: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ $black, $isIndexPage }) =>
    $black && $isIndexPage ? "30px" : "25px"};
  height: ${({ $black, $isIndexPage }) =>
    $black && $isIndexPage ? "30px" : "25px"};
  border: 2px solid ${({ $black }) => ($black ? Color.BLACK : "lightgray")};
  border-radius: 100%;
  transform: translate(-50%, -50%);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.5s cubic-bezier(0.75, -1.27, 0.3, 2.33),
    opacity 0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33),
    border 0.1s cubic-bezier(0.75, -0.27, 0.3, 1.33) 0.25s;
  -webkit-transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.5s cubic-bezier(0.75, -1.27, 0.3, 2.33),
    opacity 0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33),
    border 0.1s cubic-bezier(0.75, -0.27, 0.3, 1.33) 0.25s;
  user-select: none;
  z-index: 999;
  pointer-events: none;

  ${({ $hover }) =>
    $hover &&
    css`
      opacity: 0.7;
      transform: translate(-50%, -50%) scale(2.5);
      border: 1px solid lightgray;
    `};
`;

const Dot = styled.div<{
  $black: boolean;
  $isIndexPage: boolean;
  $hover: boolean;
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: ${({ $black, $isIndexPage }) =>
    $black && $isIndexPage ? Color.BLACK : "transparent"};
  border-radius: 100%;
  transform: translate(-50%, -50%) scale(1);
  transition: 0.3s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform 0.4s,
    0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity;
  user-select: none;
  z-index: 999;
  pointer-events: none;

  ${({ $hover }) =>
    $hover &&
    css`
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(0);
      transition: 0.3s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform 0s;
    `};
`;
