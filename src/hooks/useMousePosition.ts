import * as React from "react";
import mousePositionType from "../types/mousePositionType";

const DEFAULT_MOUSE_POSITION: mousePositionType = {
  x: null,
  y: null,
};

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = React.useState<mousePositionType>(
    DEFAULT_MOUSE_POSITION
  );

  React.useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) =>
      setMousePosition({ x: event.clientX, y: event.clientY });

    document.addEventListener("mousemove", mouseMoveHandler);
    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);

  return mousePosition;
}
