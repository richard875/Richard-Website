import * as React from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import { COLOR } from "../../styles/theme";
import useMousePosition from "../../hooks/useMousePosition";
import MousePosition from "../../types/mousePosition";

const Cursor = ({
  hover,
  delay,
  position,
  isBlack,
  isIndexPage,
}: {
  hover: boolean;
  delay: number;
  position: MousePosition;
  isBlack: boolean;
  isIndexPage?: boolean;
}) => {
  if (typeof window === "undefined") return <></>;
  const { x, y } = useMousePosition(position);

  const ringRef = React.useRef<HTMLDivElement>();
  const dotRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 0.2 });
  }, []);

  React.useEffect(() => {
    gsap.to(ringRef.current!, { css: { left: x!, top: y! } });
    gsap.to(dotRef.current!, { css: { left: x!, top: y! } });
  }, [x, y]);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: delay }}
    >
      <Ring
        ref={ringRef}
        hover={hover}
        black={isBlack}
        isIndexPage={isIndexPage}
      ></Ring>
      <Dot
        ref={dotRef}
        hover={hover}
        black={isBlack}
        isIndexPage={isIndexPage}
      ></Dot>
    </Container>
  );
};

export default Cursor;

const Container = styled(motion.span)``;

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props: any) =>
    props.black && props.isIndexPage ? "30px" : "25px"};
  height: ${(props: any) =>
    props.black && props.isIndexPage ? "30px" : "25px"};
  border: 2px solid ${(props: any) => (props.black ? COLOR.BLACK : "lightgray")};
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

  ${(props: any) =>
    props.hover &&
    css`
      opacity: 0.7;
      transform: translate(-50%, -50%) scale(2.5);
      border: 1px solid lightgray;
    `};
`;

const Dot = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: ${(props: any) =>
    props.black && props.isIndexPage ? COLOR.BLACK : "transparent"};
  border-radius: 100%;
  transform: translate(-50%, -50%) scale(1);
  transition: 0.3s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform 0.4s,
    0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity;
  user-select: none;
  z-index: 999;
  pointer-events: none;

  ${(props: any) =>
    props.hover &&
    css`
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(0);
      transition: 0.3s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform 0s;
    `};
`;
