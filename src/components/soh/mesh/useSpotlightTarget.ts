import React from "react";
import * as THREE from "three";

// A spotLight's `.target` only inherits the model's rotation if it's a
// genuinely parented <object3D>, not just a position handed to it via a
// prop - every fixture that aims a spotLight (SailFloodlight, DockLight,
// StreetlampSpot) renders that target as a sibling <object3D> and wires the
// two together here once both refs exist, rather than each repeating the
// same ref pair + effect.
const useSpotlightTarget = () => {
  const lightRef = React.useRef<THREE.SpotLight>(null!);
  const targetRef = React.useRef<THREE.Object3D>(null);

  React.useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  return { lightRef, targetRef };
};

export default useSpotlightTarget;
