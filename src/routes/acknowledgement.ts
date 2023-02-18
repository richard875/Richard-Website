import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";

const acknowledgement = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  event.preventDefault();
  document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
  navigate(Route.Acknowledgement, {
    state: { x: event.clientX, y: event.clientY },
  });
};

export default acknowledgement;
