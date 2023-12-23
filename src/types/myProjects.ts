import Icon from "../enums/icons";
import SentenceDescription from "./sentenceDescription";

type MyProjects = {
  name: string;
  image: Icon;
  imageAlt: string;
  imageHeight: number;
  linkUrl?: string;
  media?: string;
  portraitOperation?: boolean; // true for portrait, false for landscape
  widthLarge?: string;
  widthMedium?: string;
  description: SentenceDescription[][];
  techStack: string[];
};

export default MyProjects;
