export type JobDescription = {
  content: string;
  isLink?: boolean;
  url?: string;
};

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
  description: JobDescription[][];
  techStack: string[];
};

export default WorkExperience;
