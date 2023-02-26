import React from "react";
import { AnimatePresence } from "framer-motion";
import "./src/styles/global.scss";
import "./src/styles/tailwind.css";
import { MODE, STANDALONE } from "./src/constants/meta";

export const wrapPageElement = ({ element }) => (
  <AnimatePresence mode="wait">{element}</AnimatePresence>
);

export const onServiceWorkerUpdateReady = () => {
  // Detect if the page is opened as a PWA
  const params = new URLSearchParams(window.location.search);
  const isPwa = params.get(MODE) === STANDALONE;

  if (isPwa) {
    const answer = window.confirm(
      `This application has been updated. ` +
        `Reload to display the latest version?`
    );

    if (answer === true) {
      window.location.reload();
    }
  }
};
