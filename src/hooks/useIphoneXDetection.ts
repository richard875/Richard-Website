import React from "react";

const IPHONEX_ASPECT_RATIO = "0.462";

const useIphoneXDetection = () => {
  const [isIphoneX, setIsIphoneX] = React.useState(false);

  React.useEffect(() => {
    const detectIphoneX = () => {
      let iPhone =
        /iPhone/.test(navigator.userAgent) && !(window as any).MSStream;
      let aspect = window.screen.width / window.screen.height;
      setIsIphoneX(iPhone && aspect.toFixed(3) === IPHONEX_ASPECT_RATIO);
    };

    detectIphoneX();
    window.addEventListener("resize", detectIphoneX);
    return () => window.removeEventListener("resize", detectIphoneX);
  }, []);

  return isIphoneX;
};

export default useIphoneXDetection;
