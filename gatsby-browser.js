import React from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "splitting/dist/splitting.css";
import "./src/styles/global.scss";
import "./src/styles/tailwind.css";
import { MODE, STANDALONE } from "./src/constants/meta";

// Icon CSS is imported above instead of being injected at runtime;
// without this, SSR pages flash full-width icons on first paint.
config.autoAddCss = false;

export const wrapPageElement = ({ element }) => (
  <MotionConfig reducedMotion="user">
    <AnimatePresence mode="wait">{element}</AnimatePresence>
  </MotionConfig>
);

export const onServiceWorkerUpdateReady = () => {
  // Detect if the page is opened as a PWA
  const params = new URLSearchParams(window.location.search);
  const isPwa = params.get(MODE) === STANDALONE;

  if (isPwa) {
    const answer = window.confirm(
      `This application has been updated. ` +
        `Reload to display the latest version?`,
    );

    if (answer === true) {
      window.location.reload();
    }
  }
};
