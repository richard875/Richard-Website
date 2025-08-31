import Icon from "../enums/icons";

export type Skill = {
  name: Icon;
  displayName: string;
  displayNameMobile?: string;
  skill?: number;
};

type Skills = {
  primary: Skill[];
  secondary: Skill[];
};

export default Skills;
