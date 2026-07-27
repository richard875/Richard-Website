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
  descriptionFontSizeAdjust?: FontSizeAdjust;
};

export type FontSizeAdjust = {
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  xxxl?: number;
};

export default WorkExperience;
