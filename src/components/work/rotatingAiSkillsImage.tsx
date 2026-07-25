import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { AI_ICONS } from "../../enums/icons";
import layout from "../../styles/layout";
import iconPicker from "../../helper/iconPicker";

const AI_ICON_ROTATION_INTERVAL_MS = 1500;

const pickNextAiIcon = (current: Icon): Icon => {
  const options = AI_ICONS.filter((icon) => icon !== current);
  return options[Math.floor(Math.random() * options.length)];
};

const RotatingAiSkillsImage = ({
  isDarkMode,
  alt,
}: {
  isDarkMode: boolean;
  alt: string;
}) => {
  const [icon, setIcon] = useState<Icon>(AI_ICONS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIcon((current) => pickNextAiIcon(current));
    }, AI_ICON_ROTATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <RotatingSkillsImage
        key={icon}
        src={iconPicker(icon, isDarkMode)}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
    </AnimatePresence>
  );
};

export default RotatingAiSkillsImage;

export const skillsImageStyles = css`
  width: auto;
  height: 20px;
  margin-left: 10px;
  margin-bottom: 4px;
  user-select: none;

  @media ${layout.up.sm} {
    margin-bottom: 3px;
  }

  @media ${layout.up.xxxl} {
    height: 23px;
  }
`;

const RotatingSkillsImage = styled(motion.img)`
  ${skillsImageStyles}
`;
