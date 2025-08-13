import Media from "../enums/media";
import canary from "../../static/videos/canary.mp4";
import maily from "../../static/videos/maily.mp4";
import neetcode from "../../static/videos/neetcode.mp4";
import piston from "../../static/videos/piston.mp4";
import smh from "../../static/videos/smh.mp4";

const mediaPicker = (media: string) => {
  switch (media) {
    case Media.Canary:
      return canary;
    case Media.Maily:
      return maily;
    case Media.Neetcode:
      return neetcode;
    case Media.Piston:
      return piston;
    case Media.SMH:
      return smh;
    default:
      return Media.Empty;
  }
};

export default mediaPicker;
