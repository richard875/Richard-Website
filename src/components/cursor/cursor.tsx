import * as React from "react";
import styled, { css } from "styled-components";
import useMousePosition from "../../hooks/useMousePosition";

const Cursor = ({ hover }: { hover: boolean }) => {
  const { x, y } = useMousePosition();

  return (
    <>
      <Ring hover={hover} style={{ left: `${x}px`, top: `${y}px` }}></Ring>
      <Dot hover={hover} style={{ left: `${x}px`, top: `${y}px` }}></Dot>
    </>
  );
};

export default Cursor;

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(31, 30, 30, 0.808);
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
      border-width: 3px;
      border-color: lightgray;
    `};
`;

const Dot = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: black;
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
