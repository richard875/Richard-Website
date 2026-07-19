import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import SplitText from "../motion/SplitText";
import HoverRoll from "../motion/HoverRoll";
import useDarkModeManager from "../../hooks/useDarkModeManager";
import { NAME, URL, LINKEDIN_URL, GITHUB_URL } from "../../constants/meta";
import {
  CONTACT_GITHUB,
  CONTACT_LINKEDIN,
  CONTACT_TO_INTRO,
  CONTACT_TO_PROJECTS,
  CONTACT_TO_EDUCATION,
  CONTACT_TO_EXPERIENCE,
  CONTACT_TO_INDEX_BOTTOM,
} from "../../constants/googleTags";

// This whole block fades in as one unit (opacity 0 -> 1, delay 0.5s, duration
// 0.4s below) — the nav words' own SplitText entrance must start no earlier
// than that finishes, or its per-character reveal plays out while the
// block is still fully transparent and is never actually seen.
const URL_REVEAL_DELAY = 1.2;
const LINKS_REVEAL_DELAY = 1.4;
const LINKS_REVEAL_STAGGER = 0.08;

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
      transition={{ stiffness: 0, duration: 0.4, delay: 1.2 }}
    >
      <div className="flex mb-3.5">
        <a
          id={`${CONTACT_LINKEDIN}_1`}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${NAME} on LinkedIn`}
          className="mr-5 cursor-none"
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
          aria-label={`${NAME} on GitHub`}
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
      <SplitText as="h2" className="mb-2 text-lg" delay={URL_REVEAL_DELAY}>
        {URL}
      </SplitText>
      <h2 id={`${CONTACT_TO_INDEX_BOTTOM}_0`}>
        <a
          id={`${CONTACT_TO_INDEX_BOTTOM}_1`}
          href={Route.Home}
          className="mt-0.5 cursor-none hover:text-gray-400 transition-all"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => routeTo(e, Route.Home)}
        >
          <SplitText as="span" delay={LINKS_REVEAL_DELAY}>
            <HoverRoll>Home</HoverRoll>
          </SplitText>
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
          <SplitText
            as="span"
            delay={LINKS_REVEAL_DELAY + LINKS_REVEAL_STAGGER}
          >
            <HoverRoll>Intro</HoverRoll>
          </SplitText>
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
          <SplitText
            as="span"
            delay={LINKS_REVEAL_DELAY + LINKS_REVEAL_STAGGER * 2}
          >
            <HoverRoll>Experience</HoverRoll>
          </SplitText>
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
          <SplitText
            as="span"
            delay={LINKS_REVEAL_DELAY + LINKS_REVEAL_STAGGER * 3}
          >
            <HoverRoll>Projects</HoverRoll>
          </SplitText>
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
          <SplitText
            as="span"
            delay={LINKS_REVEAL_DELAY + LINKS_REVEAL_STAGGER * 4}
          >
            <HoverRoll>Education</HoverRoll>
          </SplitText>
        </a>
      </h2>
    </motion.div>
  );
};

export default Links;
