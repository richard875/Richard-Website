import * as React from "react";
import mousePositionType from "../types/mousePositionType";

export default function useMousePosition(position: mousePositionType) {
  const [mousePosition, setMousePosition] = React.useState<mousePositionType>({
    x: position?.x ?? window.innerWidth / 2,
    y: position?.y ?? window.innerHeight / 2,
  } as mousePositionType);

  React.useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) =>
      setMousePosition({ x: event.clientX, y: event.clientY });

    document.addEventListener("mousemove", mouseMoveHandler);
    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);

  return mousePosition;
}
