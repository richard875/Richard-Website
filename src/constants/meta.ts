// Site URL
export const HTTPS = "https://";

// Site Meta
export const FIRST_NAME = "Richard";
export const LAST_NAME = "Everley";
export const NAME = `${FIRST_NAME} ${LAST_NAME}`;
export const URL = process.env.GATSBY_SITE_URL;
export const EMAIL = `hello@${URL}`;
export const GITHUB_URL = `${HTTPS}github.com/richard875`;
export const LINKEDIN_URL = `${HTTPS}www.linkedin.com/in/richard875`;

// Site Config
export const MODE = "mode";
export const STANDALONE = "standalone";
export const RESUME_FILE = "richard-resume.pdf";
export const STANDALONE_URL = `?${MODE}=${STANDALONE}`;
export const ORGANIZATION = process.env.GATSBY_ORGANIZATION;
export const COPYRIGHT = `© ${new Date().getFullYear()} ${NAME} | All rights reserved.`;

// Site Title and Description
export const REGION = "Sydney, Australia";
export const OCCUPATION = "Software Engineer";
export const PAGE_TITLE = ` | ${NAME} | ${OCCUPATION}`;
export const SITE_TITLE = `${NAME} | ${OCCUPATION} | ${REGION}`;
export const SITE_KEYWORDS = `${NAME.toUpperCase()}, Software Engineer, Creative Designer, Sydney, Australia, Qantas, Coates, NZ, Government, Agency, ${FIRST_NAME}, Everley, University, Software, Engineering, React, Angular, postgresql, AWS, Amazon Web Services, SQL, Database, HTML, CSS, JavaScript, Programming, coding, api, Oracle, Agile, Student, Problem solving, Collaboration, Communication, C#, .NET, ASP, Microsoft, Google, Apple, Computer Science, Science, Motivated, Linkedin, New South Wales, United States, United Kingdom, Canada, California, New York, British Columbia, Ontario, San Francisco, Los Angeles, Boston, Texas, Washington, Florida, Connecticut, Vancouver, Ottawa, Toronto, England, London, Manchester, Birmingham`;

// Page Titles
export const INTRO_TITLE = "G'day";
export const PROJECTS_TITLE = "Projects";
export const CONTACT_TITLE = "Contact Me";
export const EDUCATION_TITLE = "Education";
export const NOT_FOUND_TITLE = "404 Not Found";
export const ACKNOWLEDGEMENT_TITLE = "Acknowledgement";
export const EXPERIENCE_TITLE = "Skills & Work Experience";

// Descriptions
export const DESCRIPTION_NOT_FOUND =
  "The page you requested could not be found. Please verify the URL or return to the homepage.";
export const DESCRIPTION_ACKNOWLEDGEMENT =
  "We acknowledge the Traditional Owners of the land where we work and live. We pay our respects to Elders past, present and emerging.";
export const DESCRIPTION_CONTACT = `Connect with ${NAME}, ${OCCUPATION} extraordinaire! Reach out via email at ${EMAIL}. Explore ${URL} for his portfolio.`;
export const DESCRIPTION_INTRO =
  "You can connect with me on LinkedIn, check out my repositories on GitHub, or reach out to me via email. I hope you find my page enjoyable and have a great day!";
export const DESCRIPTION_PROJECTS = `${FIRST_NAME}'s versatile skills showcase a range of technologies and applications, demonstrating proficiency in frontend, backend, database, and mobile development.`;
export const DESCRIPTION_INDEX = `G'day, I'm ${FIRST_NAME}. I'm a ${OCCUPATION} and Creative Designer from ${REGION}. On this corner of the internet, you'll find information about me.`;
export const DESCRIPTION_EXPERIENCE = `${NAME} is a Senior Software Engineer at Coates Group, mastering JavaScript, React, AWS, and .NET, steering teams and innovating tech solutions.`;
export const DESCRIPTION_EDUCATION =
  "Research-driven Honours graduate from the University of Sydney in Computer Science. Explored WebAssembly, edge computing, and led academic modules while excelling at Auckland in diverse disciplines, leadership, and innovation.";
