import Media from "../enums/media";
import SentenceDescription from "./sentenceDescription";

type WorkExperience = {
  company: string;
  imageHeight: number;
  jobTitle: string;
  companyTitle: string;
  start: string;
  end: string;
  city: string;
  country: string;
  description: SentenceDescription[][];
  techStack: string[];
  media?: Media;
};

export default WorkExperience;
