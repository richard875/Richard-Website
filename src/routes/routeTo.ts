import { navigate } from "gatsby";
import { WindowLocation } from "@reach/router";
import Route from "./route";
import Color from "../enums/color";
import { STANDALONE_URL } from "../constants/meta";
import usePwaDetection from "../hooks/usePwaDetection";

const routeTo = (
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  route: Route,
  singleColor: boolean,
  isDarkMode: boolean = false,
  defaultColor: Color = Color.BACKGROUND_BLACK
) => {
  event.preventDefault();
  const isPwa = usePwaDetection(location as WindowLocation);
  const routeLink = `${route}${isPwa ? STANDALONE_URL : ""}`;

  if (singleColor) {
    document.body.style.backgroundColor = defaultColor;
  } else {
    document.body.style.backgroundColor = isDarkMode
      ? Color.BACKGROUND_BLACK
      : Color.BACKGROUND_WHITE_SECONDARY;
  }

  navigate(routeLink, { state: { x: event.clientX, y: event.clientY } });
};

export default routeTo;
