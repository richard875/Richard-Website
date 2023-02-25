import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";
import { MODE, STANDALONE, STANDALONE_URL } from "../constants/meta";

const home = (event: React.MouseEvent<any, MouseEvent>) => {
  event.preventDefault();
  // Detect if the page is opened as a PWA
  const params = new URLSearchParams((location as any).search);
  const isPwa = params.get(MODE) === STANDALONE;
  const route = isPwa ? `${Route.Home}${STANDALONE_URL}` : Route.Home;

  document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE;
  navigate(route, { state: { x: event.clientX, y: event.clientY } });
};

export default home;
