import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import useDarkModeManager from "../../hooks/useDarkModeManager";
import { URL, LINKEDIN_URL, GITHUB_URL, FULL_NAME } from "../../constants/meta";
import {
  CONTACT_GITHUB,
  CONTACT_LINKEDIN,
  CONTACT_TO_INTRO,
  CONTACT_TO_PROJECTS,
  CONTACT_TO_EDUCATION,
  CONTACT_TO_EXPERIENCE,
  CONTACT_TO_INDEX_BOTTOM,
} from "../../constants/googleTags";

const Links = ({
  setHover,
  setTransitionColor,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  setTransitionColor: React.Dispatch<React.SetStateAction<Color>>;
}) => {
  const isDarkMode = useDarkModeManager(true, Color.BACKGROUND_BLACK);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4, delay: 0.5 }}
    >
      <div className="flex mb-4 -ml-1">
        <a
          id={`${CONTACT_LINKEDIN}_1`}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${FULL_NAME} on LinkedIn`}
          className="mr-3 cursor-none"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <motion.span
            className="inline-block"
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FontAwesomeIcon size={"2x"} icon={faLinkedin} />
          </motion.span>
        </a>
        <a
          id={`${CONTACT_GITHUB}_1`}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${FULL_NAME} on GitHub`}
          className="cursor-none"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <motion.span
            className="inline-block"
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FontAwesomeIcon size={"2x"} icon={faGithub} />
          </motion.span>
        </a>
      </div>
      <h2 className="mb-2 text-lg">{URL}</h2>
      <h2 id={`${CONTACT_TO_INDEX_BOTTOM}_0`}>
        <a
          id={`${CONTACT_TO_INDEX_BOTTOM}_1`}
          href={Route.Home}
          className="mt-0.5 cursor-none hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => routeTo(e, Route.Home)}
        >
          Home
        </a>
      </h2>
      <h2 id={`${CONTACT_TO_INTRO}_0`}>
        <a
          id={`${CONTACT_TO_INTRO}_1`}
          href={Route.Intro}
          className="mt-0.5 cursor-none hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(Color.BACKGROUND_BLACK);
            routeTo(e, Route.Intro);
          }}
        >
          Intro
        </a>
      </h2>
      <h2 id={`${CONTACT_TO_EXPERIENCE}_0`}>
        <a
          id={`${CONTACT_TO_EXPERIENCE}_1`}
          href={Route.Experience}
          className="mt-0.5 cursor-none hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY,
            );
            routeTo(e, Route.Experience, isDarkMode);
          }}
        >
          Experience
        </a>
      </h2>
      <h2 id={`${CONTACT_TO_PROJECTS}_0`}>
        <a
          id={`${CONTACT_TO_PROJECTS}_1`}
          href={Route.Projects}
          className="mt-0.5 cursor-none hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY,
            );
            routeTo(e, Route.Projects, isDarkMode);
          }}
        >
          Projects
        </a>
      </h2>
      <h2 id={`${CONTACT_TO_EDUCATION}_0`}>
        <a
          id={`${CONTACT_TO_EDUCATION}_1`}
          href={Route.Education}
          className="mt-0.5 cursor-none hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY,
            );
            routeTo(e, Route.Education, isDarkMode);
          }}
        >
          Education
        </a>
      </h2>
    </motion.div>
  );
};

export default Links;
