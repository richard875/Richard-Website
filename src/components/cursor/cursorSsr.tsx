import * as React from "react";
import { isDesktop } from "react-device-detect";
import Cursor from "./cursor";
import MousePosition from "../../types/mousePosition";

const CursorSsr = ({
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
  return (
    <>
      {isDesktop && (
        <Cursor
          hover={hover}
          delay={delay}
          position={position}
          isBlack={isBlack}
          isIndexPage={isIndexPage}
        />
      )}
    </>
  );
};

export default CursorSsr;
