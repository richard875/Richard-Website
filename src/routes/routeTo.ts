import { navigate } from "gatsby";
import { WindowLocation } from "@reach/router";
import Route from "./route";
import Color from "../enums/color";
import { STANDALONE_URL } from "../constants/meta";
import usePwaDetection from "../hooks/usePwaDetection";

const routeTo = (
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  route: Route,
  isDarkMode: boolean = true
) => {
  event.preventDefault();
  const isPwa = usePwaDetection(location as WindowLocation);
  const routeLink = `${route}${isPwa ? STANDALONE_URL : ""}`;

  switch (route) {
    case Route.Home:
      document.body.style.backgroundColor = Color.BACKGROUND_WHITE;
      break;
    case Route.Acknowledgement:
      document.body.style.backgroundColor = Color.BACKGROUND_BLACK;
      break;
    case Route.Intro:
      document.body.style.backgroundColor = Color.BACKGROUND_BLACK;
      break;
    case Route.Experience:
      document.body.style.backgroundColor = isDarkMode
        ? Color.BACKGROUND_BLACK
        : Color.BACKGROUND_WHITE_SECONDARY;
      break;
    case Route.Projects:
      document.body.style.backgroundColor = isDarkMode
        ? Color.BACKGROUND_BLACK
        : Color.BACKGROUND_WHITE_SECONDARY;
      break;
    case Route.Education:
      document.body.style.backgroundColor = isDarkMode
        ? Color.BACKGROUND_BLACK
        : Color.BACKGROUND_WHITE_SECONDARY;
      break;
    case Route.Contact:
      document.body.style.backgroundColor = Color.BACKGROUND_BLACK;
      break;
    default:
      document.body.style.backgroundColor = Color.BACKGROUND_BLACK;
      break;
  }

  navigate(routeLink, { state: { x: event.clientX, y: event.clientY } });
};

export default routeTo;
