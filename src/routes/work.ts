import { navigate } from "gatsby";
import { COLOR } from "../styles/theme";
import Route from "./route";
import { MODE, STANDALONE, STANDALONE_URL } from "../constants/meta";

const work = (
  event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  isDarkMode: boolean
) => {
  event.preventDefault();
  // Detect if the page is opened as a PWA
  const params = new URLSearchParams((location as any).search);
  const isPwa = params.get(MODE) === STANDALONE;
  const route = isPwa ? `${Route.Work}${STANDALONE_URL}` : Route.Work;

  document.body.style.backgroundColor = isDarkMode
    ? COLOR.BACKGROUND_BLACK
    : COLOR.BACKGROUND_WHITE_SECONDARY;
  navigate(route, { state: { x: event.clientX, y: event.clientY } });
};

export default work;
