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

// /experience and /projects fake horizontal scrolling by pinning content to
// the vertical scroll position (see their gsap ScrollTrigger setup). Gatsby's
// default scroll restoration fires on the outgoing page the instant the URL
// changes — well before AnimatePresence's exit animation finishes removing it
// — so it visibly yanks that still-pinned content back to its start position
// before the page transition covers it. Both pages reset their own scroll to
// 0 on mount instead, so restoration is disabled here only when leaving one
// of them, leaving default behaviour intact everywhere else.
const NO_SCROLL_RESTORE_PATHS = ["/experience", "/experience/", "/projects", "/projects/"];

export const shouldUpdateScroll = ({ prevRouterProps }) => {
  if (
    prevRouterProps &&
    NO_SCROLL_RESTORE_PATHS.includes(prevRouterProps.location.pathname)
  ) {
    return false;
  }
  return true;
};

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
