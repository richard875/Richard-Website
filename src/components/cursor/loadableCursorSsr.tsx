import React from "react";
import Loadable from "@loadable/component";

const LoadableCursorSsr = Loadable(() => import("./cursorSsr"));

export default LoadableCursorSsr;
