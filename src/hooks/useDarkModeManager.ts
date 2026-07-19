import React from "react";
import Color from "../enums/color";
import getTransitionColor from "../helper/getTransitionColor";

const useDarkModeManager = (
  singleColor: boolean,
  defaultColor: Color = Color.WHITE, // Optional Parameter
) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
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
