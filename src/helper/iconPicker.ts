import canary from "../../static/images/logos/canary.svg";
import canaryBlack from "../../static/images/logos/canary-black.svg";
import chancery from "../../static/images/logos/chancery.png";
import slik from "../../static/images/logos/slik.svg";
import slikBlack from "../../static/images/logos/slik-black.svg";
import nzGovt from "../../static/images/logos/nzgovt.png";
import nzGovtBlack from "../../static/images/logos/nzgovt-black.png";
import qantas from "../../static/images/logos/qantas.svg";
import qantasBlack from "../../static/images/logos/qantas-black.svg";
import uoa from "../../static/images/logos/uoa.png";
import usyd from "../../static/images/logos/usyd.svg";
import usydBlack from "../../static/images/logos/usyd-black.svg";
import yourcar from "../../static/images/logos/yourcar.svg";

const iconPicker = (logo: string, isDark: boolean) => {
  switch (logo) {
    case "canary":
      return isDark ? canary : canaryBlack;
    case "chancery":
      return chancery;
    case "slik":
      return isDark ? slik : slikBlack;
    case "nzgovt":
      return isDark ? nzGovt : nzGovtBlack;
    case "qantas":
      return isDark ? qantas : qantasBlack;
    case "uoa":
      return uoa;
    case "usyd":
      return isDark ? usyd : usydBlack;
    case "yourcar":
      return yourcar;
    default:
      return "";
  }
};

export default iconPicker;
