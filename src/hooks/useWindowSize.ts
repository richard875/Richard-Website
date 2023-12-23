import React from "react";
import { window } from "browser-monads-ts";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  });

  React.useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
