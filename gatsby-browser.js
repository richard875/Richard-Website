import React from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "splitting/dist/splitting.css";
import "./src/styles/global.scss";
import "./src/styles/tailwind.css";
import Route from "./src/routes/route";
import { MODE, STANDALONE } from "./src/constants/meta";

// Icon CSS is imported above instead of being injected at runtime;
// without this, SSR pages flash full-width icons on first paint.
config.autoAddCss = false;

export const wrapPageElement = ({ element }) => (
  <MotionConfig reducedMotion="user">
    <AnimatePresence mode="wait">{element}</AnimatePresence>
  </MotionConfig>
);

// /intro, /experience, /projects, and /education can all end up scrolled
// partway down (either real vertical scroll on mobile, or the vertical
// scroll that /experience and /projects fake horizontal scrolling with via
// gsap ScrollTrigger). Gatsby's default scroll restoration fires on the
// outgoing page the instant the URL changes — well before AnimatePresence's
// exit animation finishes removing it — so it visibly snaps that still-
// visible page back to the top before the page transition covers it. Each
// of these pages resets its own scroll to 0 on mount instead (see their
// useLayoutEffect), so restoration is disabled here only when leaving one
// of them, leaving default behaviour intact everywhere else.
const NO_SCROLL_RESTORE_PATHS = [
  Route.Intro,
  `${Route.Intro}/`,
  Route.Experience,
  `${Route.Experience}/`,
  Route.Projects,
  `${Route.Projects}/`,
  Route.Education,
  `${Route.Education}/`,
];

export const shouldUpdateScroll = ({ prevRouterProps }) => {
  const match =
    prevRouterProps &&
    NO_SCROLL_RESTORE_PATHS.includes(prevRouterProps.location.pathname);

  return !match;
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
