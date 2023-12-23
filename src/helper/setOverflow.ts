import React from "react";

const setOverflow = (e: React.TouchEvent<HTMLElement>, hold: boolean) => {
  e.stopPropagation();
  document.body.style.overflow = hold ? "hidden" : "auto";
};

export default setOverflow;
