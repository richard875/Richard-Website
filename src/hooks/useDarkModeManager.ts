import React from "react";
import Color from "../enums/color";
import getTransitionColor from "../helper/getTransitionColor";

const useDarkModeManager = (
  singleColor: boolean,
  defaultColor: Color = Color.WHITE, // Optional Parameter
) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Layout effect, not a passive one: this sets the page's actual resting
  // background colour, so it must land before the browser paints — a
  // regular useEffect fires a frame late and reads as a flash of the wrong
  // colour on every page transition (see initialTransition.tsx).
  React.useLayoutEffect(() => {
    if (singleColor) document.body.style.backgroundColor = defaultColor;
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    const updateIsDarkMode = () => {
      setIsDarkMode(() => {
        const isDarkMode = mediaQueryList.matches;
        if (!singleColor)
          document.body.style.backgroundColor = getTransitionColor(isDarkMode);
        return isDarkMode;
      });
    };

    mediaQueryList.addEventListener("change", updateIsDarkMode);
    updateIsDarkMode();

    return () => mediaQueryList.removeEventListener("change", updateIsDarkMode);
  }, []);

  return isDarkMode;
};

export default useDarkModeManager;
