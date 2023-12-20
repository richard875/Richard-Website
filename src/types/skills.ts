import Icon from "../enums/icons";

export type Skill = {
  name: Icon;
  displayName: string;
  skill?: number;
};

type Skills = {
  primary: Skill[];
  secondary: Skill[];
};

export default Skills;
