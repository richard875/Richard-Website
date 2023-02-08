import SentenceDescription from "./sentenceDescription";

type MyProjects = {
  name: string;
  image: string;
  imageAlt: string;
  imageHeight: number;
  hasLink?: boolean;
  linkUrl?: string;
  description: SentenceDescription[][];
  techStack: string[];
};

export default MyProjects;
