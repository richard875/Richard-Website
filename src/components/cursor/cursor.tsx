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
    gsap.defaults({ ease: "power4.out", duration: 0.7 });
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
  -webkit-transition-timing-function: ease-out;
  transition-duration: 100ms;
  -webkit-transition-duration: 100ms;
  transition-timing-function: ease-out;
  will-change: width, height, transform, border;
  z-index: 999;
  pointer-events: none;

  ${(props: any) =>
    props.hover &&
    css`
      width: 50px;
      height: 50px;
      border: 3px solid lightgray;
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
  transform: translate(-50%, -50%);
  z-index: 999;
  pointer-events: none;

  ${(props: any) =>
    props.hover &&
    css`
      display: none;
    `};
`;
