import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";

const experience = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  event.preventDefault();
  document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
  navigate(Route.Experience, {
    state: { x: event.clientX, y: event.clientY },
  });
};

export default experience;
