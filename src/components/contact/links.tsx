import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import useDarkModeManager from "../../hooks/useDarkModeManager";
import { URL, LINKEDIN_URL, GITHUB_URL } from "../../constants/meta";
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
      <div className="flex mb-4">
        <FontAwesomeIcon
          id={`${CONTACT_LINKEDIN}_1`}
          size={"2x"}
          icon={faLinkedin}
          className="mr-5"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            e.preventDefault();
            window.open(LINKEDIN_URL, "_blank");
          }}
        />
        <FontAwesomeIcon
          id={`${CONTACT_GITHUB}_1`}
          size={"2x"}
          icon={faGithub}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            e.preventDefault();
            window.open(GITHUB_URL, "_blank");
          }}
        />
      </div>
      <h2 className="mb-2 text-lg">{URL}</h2>
      <h2 id={`${CONTACT_TO_INDEX_BOTTOM}_0`}>
        <span
          id={`${CONTACT_TO_INDEX_BOTTOM}_1`}
          className="mt-0.5 hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => routeTo(e, Route.Home)}
        >
          Home
        </span>
      </h2>
      <h2 id={`${CONTACT_TO_INTRO}_0`}>
        <span
          id={`${CONTACT_TO_INTRO}_1`}
          className="mt-0.5 hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(Color.BACKGROUND_BLACK);
            routeTo(e, Route.Intro);
          }}
        >
          Intro
        </span>
      </h2>
      <h2 id={`${CONTACT_TO_EXPERIENCE}_0`}>
        <span
          id={`${CONTACT_TO_EXPERIENCE}_1`}
          className="mt-0.5 hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY
            );
            routeTo(e, Route.Experience, isDarkMode);
          }}
        >
          Experience
        </span>
      </h2>
      <h2 id={`${CONTACT_TO_PROJECTS}_0`}>
        <span
          id={`${CONTACT_TO_PROJECTS}_1`}
          className="mt-0.5 hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY
            );
            routeTo(e, Route.Projects, isDarkMode);
          }}
        >
          Projects
        </span>
      </h2>
      <h2 id={`${CONTACT_TO_EDUCATION}_0`}>
        <span
          id={`${CONTACT_TO_EDUCATION}_1`}
          className="mt-0.5 hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setTransitionColor(
              isDarkMode
                ? Color.BACKGROUND_BLACK
                : Color.BACKGROUND_WHITE_SECONDARY
            );
            routeTo(e, Route.Education, isDarkMode);
          }}
        >
          Education
        </span>
      </h2>
    </motion.div>
  );
};

export default Links;
