import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { motion, useAnimationControls } from "framer-motion";
import Icon from "../../enums/icons";
import layout from "../../styles/layout";
import iconPicker from "../../helper/iconPicker";
import {
  sparkleEntranceEffect,
  sparkleSpinWiggleEffect,
} from "../../helper/motionConfig";
import { IMAGE_DEFAULT_HEIGHT } from "../../constants/margin";

// The "My Skills" sparkle logo: entrance plays once on mount via imperative
// controls, then hover spins it a full turn into a little wiggle (also
// imperative, so it always finishes — see sparkleSpinWiggleEffect).
//
// Deliberately no `initial` prop — the pre-entrance pose is set via
// controls.set() in useLayoutEffect instead (before first paint, so no
// flash), so there's nothing declared statically for `animate` to conflict
// with later.
const SparkleLogo = ({
  className,
  height,
  style,
  isDarkMode,
}: {
  className?: string;
  height: number;
  style?: React.CSSProperties;
  isDarkMode: boolean;
}) => {
  const controls = useAnimationControls();
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);

  useLayoutEffect(() => {
    controls.set(sparkleEntranceEffect.initial);
    controls.start({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: sparkleEntranceEffect.transition,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Logo
      className={className}
      $height={height}
      style={style}
      src={iconPicker(Icon.Sparkle, isDarkMode)}
      alt={"My Skills"}
      animate={controls}
      onMouseEnter={() => {
        // Ignore re-hovers while a spin is still playing — starting a
        // second one mid-flight would jump the rotation, not layer cleanly.
        if (isSpinningRef.current) return;
        isSpinningRef.current = true;
        const base = rotationRef.current;
        rotationRef.current += 360;
        controls.start(sparkleSpinWiggleEffect(base)).then(() => {
          isSpinningRef.current = false;
        });
      }}
    />
  );
};

export default SparkleLogo;

const Logo = styled(motion.img)<{ $height: number }>`
  width: auto;
  height: ${({ $height }) => $height + "px"};
  margin-left: 8px;
  user-select: none;

  @media ${layout.up.xxxl} {
    margin-top: ${({ $height }) =>
      10 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
    margin-bottom: ${({ $height }) =>
      15 - ($height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  }
`;
