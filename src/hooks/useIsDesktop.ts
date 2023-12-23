import React from "react";
import { isDesktop } from "react-device-detect";

const useIsDesktop = () => {
  const [isOnDesktop, setIsOnDesktop] = React.useState(true);

  React.useEffect(() => {
    const detectDesktop = () => setIsOnDesktop(isDesktop);

    detectDesktop();
    window.addEventListener("resize", detectDesktop);
    return () => window.removeEventListener("resize", detectDesktop);
  }, []);

  return isOnDesktop;
};

export default useIsDesktop;
