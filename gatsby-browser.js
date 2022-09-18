import React from "react";
import { AnimatePresence } from "framer-motion";
import "./src/styles/global.scss";
import "./src/styles/tailwind.css";

export const wrapPageElement = ({ element }) => (
  <AnimatePresence mode="wait">{element}</AnimatePresence>
);
