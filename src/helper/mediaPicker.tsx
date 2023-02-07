import cie from "../../static/videos/cie.mp4";
import smh from "../../static/videos/smh.mp4";

const mediaPicker = (media: string) => {
  switch (media) {
    case "cie":
      return cie;
    case "smh":
      return smh;
    default:
      return "";
  }
};

export default mediaPicker;
