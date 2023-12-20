import React from "react";
import MousePosition from "../types/mousePosition";

const useMousePosition = (position: MousePosition) => {
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: 0,
    y: 0,
  } as MousePosition);

  // Set initial position after first render
  React.useEffect(() => {
    setMousePosition({
      x: position?.x ?? window.innerWidth / 2,
      y: position?.y ?? window.innerHeight / 2,
    });
  }, []);

  // Update position on mouse move
  React.useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) =>
      setMousePosition({ x: event.clientX, y: event.clientY });

    document.addEventListener("mousemove", mouseMoveHandler);
    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);

  return mousePosition;
};

export default useMousePosition;
