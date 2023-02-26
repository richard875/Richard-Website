require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

export const NAME = "Richard Lee";
export const URL = process.env.SITE_URL;
export const EMAIL = `hello@${URL}`;
export const MODE = "mode";
export const STANDALONE = "standalone";
export const STANDALONE_URL = `?${MODE}=${STANDALONE}`;
export const ORGANIZATION = process.env.ORGANIZATION;

export const SITE_TITLE = `${NAME} | Software Engineer | University of Sydney`;
export const SITE_DESCRIPTION =
  "G'day, I'm Richard. I'm a postgraduate student at the University of Sydney, Australia. On this corner of the internet, you'll find information about me.";
export const SITE_KEYWORDS =
  "Richard, Lee, University, Sydney, Software, Engineering, React, Angular, postgresql, SQL, Database, HTML, CSS, JavaScript, Programming, coding, api, Oracle, Agile, Student, Problem solving, Collaboration, Communication, C#, .NET, ASP, Microsoft, Google, Apple, Computer Science, Science, Australia, Motivated, Linkedin, New South Wales";
