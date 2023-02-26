import React from "react";
import { AnimatePresence } from "framer-motion";
import "./src/styles/global.scss";
import "./src/styles/tailwind.css";

export const wrapPageElement = ({ element }) => (
  <AnimatePresence mode="wait">{element}</AnimatePresence>
);

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};
