import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";

const education = (
  event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  isDarkMode: boolean
) => {
  event.preventDefault();
  document.body.style.backgroundColor = isDarkMode
    ? COLOR.BACKGROUND_BLACK
    : COLOR.BACKGROUND_WHITE_SECONDARY;
  navigate(Route.Education, {
    state: { x: event.clientX, y: event.clientY },
  });
};

export default education;
