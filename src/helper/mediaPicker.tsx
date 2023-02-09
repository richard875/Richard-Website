import cie from "../../static/videos/cie.mp4";
import smh from "../../static/videos/smh.mp4";
import neetcode from "../../static/videos/neetcode.mp4";
import piston from "../../static/videos/piston.mp4";

const mediaPicker = (media: string) => {
  switch (media) {
    case "cie":
      return cie;
    case "smh":
      return smh;
    case "neetcode":
      return neetcode;
    case "piston":
      return piston;
    default:
      return "";
  }
};

export default mediaPicker;
