import React from "react";
import { NIGHT_MOON_POSITION } from "./lightingKeyframes";

// Night-only moon disc + soft halo, fixed at NIGHT_MOON_POSITION (same
// position the directional "moon" light uses at night) so the visible disc
// and the water's moon-glint always agree.
const Moon = () => (
  <group position={NIGHT_MOON_POSITION}>
    {/* Tone-mapped like everything else - an unclamped, un-tonemapped
        bright point here fed a raw HDR spike into DepthOfField/Bloom
        that showed up as garish rainbow ring artifacts. */}
    <mesh>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshBasicMaterial color="#eef4ff" />
    </mesh>
    {/* Soft halo so the moon reads as glowing rather than a flat disc. */}
    <mesh scale={2.4}>
      <sphereGeometry args={[0.4, 24, 24]} />
      <meshBasicMaterial
        color="#cfe0ff"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  </group>
);

export default Moon;
