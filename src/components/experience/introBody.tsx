import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Color from "../../enums/color";
import SplitText from "../motion/splitText";
import HoverRoll from "../motion/hoverRoll";
import useUnderlineFlicker from "../../hooks/useUnderlineFlicker";
import {
  INTRO_EMAIL,
  INTRO_GITHUB,
  INTRO_LINKEDIN,
  INTRO_AUSTRALIA,
} from "../../constants/googleTags";
import {
  HTTPS,
  EMAIL,
  FIRST_NAME,
  GITHUB_URL,
  LINKEDIN_URL,
} from "../../constants/meta";

const AUSTRALIA = `${HTTPS}www.youtube.com/watch?v=rMdbVHPmCW0`;

const UNDERLINE_STAGGER = 0.05;

// Memoised so its identity is stable across re-renders — SplitText splits
// this into characters once and a parent re-render must not rebuild the
// nodes underneath it.
//
// LinkedIn/GitHub/email are HoverRoll, not plain text: that adds the
// hover-roll interaction to the very `.char` spans this single SplitText
// produces for them, rather than giving them their own separate split and
// reveal — see HoverRoll' own doc comment for how it grafts onto
// SplitText's DOM instead of doing its own split.
const IntroBody = ({
  delay,
  underlineDelay,
}: {
  delay: number;
  underlineDelay: number;
}) => {
  const linkedInUnderline = useUnderlineFlicker();
  const githubUnderline = useUnderlineFlicker();
  const emailUnderline = useUnderlineFlicker();

  return React.useMemo(
    () => (
      <SplitText as="span" className="split-fast" delay={delay} amount={0.1}>
        G'day, I'm {FIRST_NAME}. I'm a Software Engineer and Creative Designer
        from<Sydney>&nbsp;Sydney</Sydney>,
        <Australia
          id={`${INTRO_AUSTRALIA}_0`}
          onClick={(e) => {
            e.preventDefault();
            window.open(AUSTRALIA, "_blank");
          }}
        >
          &nbsp;Australia
        </Australia>
        . On this corner of the internet, you'll find information about me. You
        can connect with me on&nbsp;
        <LinkedIn id={`${INTRO_LINKEDIN}_0`}>
          <a
            id={`${INTRO_LINKEDIN}_1`}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverRoll
              stagger={0.014}
              onRollStart={linkedInUnderline.onRollStart}
              onRollComplete={linkedInUnderline.onRollComplete}
            >
              LinkedIn
            </HoverRoll>
          </a>
          <Underline
            ref={linkedInUnderline.ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: underlineDelay,
            }}
          />
        </LinkedIn>
        , check out my repositories on&nbsp;
        <Github id={`${INTRO_GITHUB}_0`}>
          <a
            id={`${INTRO_GITHUB}_1`}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverRoll
              stagger={0.016}
              onRollStart={githubUnderline.onRollStart}
              onRollComplete={githubUnderline.onRollComplete}
            >
              GitHub
            </HoverRoll>
          </a>
          <Underline
            ref={githubUnderline.ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: underlineDelay + UNDERLINE_STAGGER,
            }}
          />
        </Github>
        , or reach out to me via&nbsp;
        <Email id={`${INTRO_EMAIL}_0`}>
          <a
            id={`${INTRO_EMAIL}_1`}
            href={`mailto:${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HoverRoll
              onRollStart={emailUnderline.onRollStart}
              onRollComplete={emailUnderline.onRollComplete}
            >
              email
            </HoverRoll>
          </a>
          <Underline
            ref={emailUnderline.ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: underlineDelay + UNDERLINE_STAGGER * 2,
            }}
          />
        </Email>
        . I hope you find my page enjoyable and have a great day!
      </SplitText>
    ),
    [],
  );
};

export default IntroBody;

const HoverableText = styled.span`
  cursor: pointer;
`;

// position: relative + display: inline-block so the Underline bar below can
// position itself against this (unsplit) span rather than some distant
// ancestor. display: inline-block matters as much as position: relative
// here: an absolutely positioned child of a plain `inline` box has a
// browser-inconsistent containing block for `left`/`right`, so `left: 0;
// right: 0` resolves against the wrong width and the bar drifts off to one
// side. inline-block gives it a proper box to anchor to while still
// wrapping like a word within the surrounding text.
const HoverableTextUnderline = styled(HoverableText)`
  position: relative;
  display: inline-block;
`;

// A real text-decoration underline can't be used here: this text sits inside
// a per-character SplitText reveal, which wraps each char in its own
// `display: inline-block` span (splitting.css), and text-decoration can't
// paint through those — each char ends up drawing its own tiny underline
// segment instead of one continuous line. This bar sidesteps the problem by
// living outside the split text entirely: it's a separate, absolutely
// positioned element with its own `currentColor` background, so it always
// renders as one unbroken line regardless of what SplitText does to the text
// above it. Its opacity (not the bar itself) is what fades in via
// framer-motion, on the usages below.
const Underline = styled(motion.span)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.67vw;
  height: 3px;
  background-color: currentColor;
`;

const Sydney = styled.span`
  color: ${Color.SYDNEY_ORANGE};
`;

const Australia = styled(HoverableText)`
  cursor: pointer;
  color: ${Color.AUSTRALIA_GOLD};
`;

const LinkedIn = styled(HoverableTextUnderline)`
  color: ${Color.LINKEDIN_BLUE};
`;

const Github = styled(HoverableTextUnderline)`
  color: ${Color.BACKGROUND_WHITE};
`;

const Email = styled(HoverableTextUnderline)`
  color: ${Color.BLUE};
`;
