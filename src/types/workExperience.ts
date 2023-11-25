import SentenceDescription from "./sentenceDescription";

type JobPeriod = {
  mobile: string;
  desktop: string;
};

type WorkExperience = {
  company: string;
  imageHeight: number;
  jobTitle: string;
  companyTitle: string;
  start: JobPeriod;
  end: JobPeriod;
  city: string;
  country: string;
  description: SentenceDescription[][];
  techStack: string[];
  media?: string;
};

export default WorkExperience;
