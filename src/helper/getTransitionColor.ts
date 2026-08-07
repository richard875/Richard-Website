import Color from "../enums/color";

// The gallery pages (experience/projects/education) only ever need this
// exact ternary when wiring a nav click to `setTransitionColor` — pulled
// out because it was showing up identically at every call site.
const getTransitionColor = (isDarkMode: boolean): Color =>
  isDarkMode ? Color.BACKGROUND_BLACK : Color.BACKGROUND_WHITE_SECONDARY;

export default getTransitionColor;
