import SentenceDescription from "./sentenceDescription";

type MyProjects = {
  name: string;
  image: string;
  imageAlt: string;
  imageHeight: number;
  hasLink?: boolean;
  linkUrl?: string;
  hasMedia: boolean;
  media?: string;
  portraitOperation?: boolean; // true for portrait, false for landscape
  description: SentenceDescription[][];
  techStack: string[];
};

export default MyProjects;
