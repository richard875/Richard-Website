import canary from "../../static/images/logos/canary.svg";
import canaryBlack from "../../static/images/logos/canary-black.svg";
import chancery from "../../static/images/logos/chancery.png";
import nasdaq from "../../static/images/logos/nasdaq.svg";
import nasdaqBlack from "../../static/images/logos/nasdaq-black.svg";
import neetcode from "../../static/images/logos/neetcode.svg";
import neetcodeBlack from "../../static/images/logos/neetcode-black.svg";
import slik from "../../static/images/logos/slik.svg";
import slikBlack from "../../static/images/logos/slik-black.svg";
import nzGovt from "../../static/images/logos/nzgovt.png";
import nzGovtBlack from "../../static/images/logos/nzgovt-black.png";
import piston from "../../static/images/logos/piston.png";
import qantas from "../../static/images/logos/qantas.svg";
import qantasBlack from "../../static/images/logos/qantas-black.svg";
import redbull from "../../static/images/logos/redbull.png";
import uoa from "../../static/images/logos/uoa.png";
import usyd from "../../static/images/logos/usyd.svg";
import usydBlack from "../../static/images/logos/usyd-black.svg";
import yourcar from "../../static/images/logos/yourcar.svg";
import youtube from "../../static/images/logos/youtube.svg";

const iconPicker = (logo: string, isDark: boolean) => {
  switch (logo) {
    case "canary":
      return isDark ? canary : canaryBlack;
    case "chancery":
      return chancery;
    case "nasdaq":
      return isDark ? nasdaq : nasdaqBlack;
    case "neetcode":
      return isDark ? neetcode : neetcodeBlack;
    case "slik":
      return isDark ? slik : slikBlack;
    case "nzgovt":
      return isDark ? nzGovt : nzGovtBlack;
    case "piston":
      return piston;
    case "qantas":
      return isDark ? qantas : qantasBlack;
    case "redbull":
      return redbull;
    case "uoa":
      return uoa;
    case "usyd":
      return isDark ? usyd : usydBlack;
    case "yourcar":
      return yourcar;
    case "youtube":
      return youtube;
    default:
      return "";
  }
};

export default iconPicker;
