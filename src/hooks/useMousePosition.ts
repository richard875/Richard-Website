import React from "react";
import MousePosition from "../types/mousePosition";

const useMousePosition = (position: MousePosition) => {
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: position?.x ?? window.innerWidth / 2,
    y: position?.y ?? window.innerHeight / 2,
  } as MousePosition);

  React.useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) =>
      setMousePosition({ x: event.clientX, y: event.clientY });

    document.addEventListener("mousemove", mouseMoveHandler);
    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);

  return mousePosition;
};

export default useMousePosition;
