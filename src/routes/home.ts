import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";

const home = (event: React.MouseEvent<any, MouseEvent>) => {
  event.preventDefault();
  document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE;
  navigate(Route.Home, { state: { x: event.clientX, y: event.clientY } });
};

export default home;
