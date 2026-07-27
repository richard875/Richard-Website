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
}: {
  hover: boolean;
  delay: number;
  position: MousePosition;
  isBlack: boolean;
}) => {
  const isDesktop = useIsDesktop();
  const { x, y } = useMousePosition(position);

  const ringRef = React.useRef(null);
  const dotRef = React.useRef(null);
  const moveRef = React.useRef<((x: number, y: number) => void) | null>(null);

  // The dot tracks tightly while the ring trails on a softer ease,
  // giving the cursor a sense of weight. quickTo reuses one tween per
  // property instead of spawning a new tween on every mousemove.
  React.useEffect(() => {
    if (!ringRef.current || !dotRef.current) return;

    const ringX = gsap.quickTo(ringRef.current, "left", {
      duration: 0.34,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ringRef.current, "top", {
      duration: 0.34,
      ease: "power3.out",
    });
    const dotX = gsap.quickTo(dotRef.current, "left", {
      duration: 0.15,
      ease: "power3.out",
    });
    const dotY = gsap.quickTo(dotRef.current, "top", {
      duration: 0.15,
      ease: "power3.out",
    });

    moveRef.current = (xPos: number, yPos: number) => {
      ringX(xPos);
      ringY(yPos);
      dotX(xPos);
      dotY(yPos);
    };
  }, [isDesktop]);

  React.useEffect(() => {
    if (x !== null && y !== null) moveRef.current?.(x, y);
  }, [x, y]);

  return (
    isDesktop && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay }}
      >
        <Ring ref={ringRef} $hover={hover} $black={isBlack}></Ring>
        <Dot ref={dotRef} $hover={hover} $black={isBlack}></Dot>
      </motion.span>
    )
  );
};

export default Cursor;

const Ring = styled.div<{
  $black: boolean;
  $hover: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 25px;
  height: 25px;
  border: 2px solid ${({ $black }) => ($black ? Color.BLACK : "lightgray")};
  border-radius: 100%;
  transform: translate(-50%, -50%);
  transition:
    width 0.32s cubic-bezier(0.75, -1.27, 0.3, 2.33),
    height 0.32s cubic-bezier(0.75, -1.27, 0.3, 2.33),
    opacity 0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33),
    border 0.1s cubic-bezier(0.75, -0.27, 0.3, 1.33) 0.15s;
  -webkit-transition:
    width 0.32s cubic-bezier(0.75, -1.27, 0.3, 2.33),
    height 0.32s cubic-bezier(0.75, -1.27, 0.3, 2.33),
    opacity 0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33),
    border 0.1s cubic-bezier(0.75, -0.27, 0.3, 1.33) 0.15s;
  user-select: none;
  z-index: 999999;
  pointer-events: none;

  ${({ $hover }) =>
    $hover &&
    css`
      opacity: 0.7;
      width: 65px;
      height: 65px;
      border: 2px solid lightgray;
    `};
`;

const Dot = styled.div<{
  $black: boolean;
  $hover: boolean;
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: ${({ $black }) => ($black ? Color.BLACK : "lightgray")};
  border-radius: 100%;
  transform: translate(-50%, -50%) scale(1);
  transition:
    transform 0.22s cubic-bezier(0.75, -1.27, 0.3, 2.33) 0.12s,
    opacity 0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33);
  user-select: none;
  z-index: 999999;
  pointer-events: none;

  ${({ $hover }) =>
    $hover &&
    css`
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.22s cubic-bezier(0.75, -1.27, 0.3, 2.33);
    `};
`;
