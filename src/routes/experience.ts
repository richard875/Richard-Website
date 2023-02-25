import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";
import { MODE, STANDALONE, STANDALONE_URL } from "../constants/meta";

const experience = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
  event.preventDefault();
  // Detect if the page is opened as a PWA
  const params = new URLSearchParams((location as any).search);
  const isPwa = params.get(MODE) === STANDALONE;
  const route = isPwa
    ? `${Route.Experience}${STANDALONE_URL}`
    : Route.Experience;

  document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
  navigate(route, { state: { x: event.clientX, y: event.clientY } });
};

export default experience;
