import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";

const contact = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
  event.preventDefault();
  document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
  navigate(Route.Contact, { state: { x: event.clientX, y: event.clientY } });
};

export default contact;
