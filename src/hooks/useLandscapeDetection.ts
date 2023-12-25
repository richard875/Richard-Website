import React from "react";

const useLandscapeDetection = (isPwa: boolean) => {
  const [isLandscape, setIsLandscape] = React.useState(false);
  const eventListenerType = isPwa ? "orientationchange" : "resize";

  React.useEffect(() => {
    const handleOrientationChange = () => {
      const orientation = window.orientation;
      if (orientation === undefined) return;

      setIsLandscape(orientation === 90 || orientation === -90);
    };

    handleOrientationChange();
    window.addEventListener(eventListenerType, handleOrientationChange);

    return () =>
      window.removeEventListener(eventListenerType, handleOrientationChange);
  }, []);

  return isLandscape;
};

export default useLandscapeDetection;
