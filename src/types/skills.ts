export type Skill = {
  name: string;
  displayName: string;
  skill?: number;
};

type Skills = {
  primary: Skill[];
  secondary: Skill[];
};

export default Skills;
