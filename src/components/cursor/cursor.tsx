import * as React from "react";
import styled, { css } from "styled-components";
import { COLOR } from "../../styles/theme";
import useMousePosition from "../../hooks/useMousePosition";
import mousePositionType from "../../types/mousePositionType";

const Cursor = ({
  hover,
  position,
  isBlack,
}: {
  hover: boolean;
  position: mousePositionType;
  isBlack: boolean;
}) => {
  if (typeof window === "undefined") return;
  const { x, y } = useMousePosition(position);

  return (
    <>
      <Ring
        hover={hover}
        black={isBlack}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></Ring>
      <Dot
        hover={hover}
        black={isBlack}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></Dot>
    </>
  );
};

export default Cursor;

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props: any) => (props.black ? "30px" : "25px")};
  height: ${(props: any) => (props.black ? "30px" : "25px")};
  border: 2px solid ${(props: any) => (props.black ? COLOR.BLACK : "lightgray")};
  border-radius: 100%;
  transform: translate(-50%, -50%);
  -webkit-transition-duration: 100ms;
  transition-duration: 100ms;
  -webkit-transition-timing-function: ease-out;
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
    props.black ? COLOR.BLACK : "transparent"};
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
