import canary from "../../static/videos/canary.mp4";
import cie from "../../static/videos/cie.mp4";
import maily from "../../static/videos/maily.mp4";
import neetcode from "../../static/videos/neetcode.mp4";
import piston from "../../static/videos/piston.mp4";
import smh from "../../static/videos/smh.mp4";

const mediaPicker = (media: string) => {
  switch (media) {
    case "canary":
      return canary;
    case "cie":
      return cie;
    case "maily":
      return maily;
    case "neetcode":
      return neetcode;
    case "piston":
      return piston;
    case "smh":
      return smh;
    default:
      return "";
  }
};

export default mediaPicker;
