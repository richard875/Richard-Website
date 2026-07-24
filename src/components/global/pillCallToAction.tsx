import React from "react";
import styled from "styled-components";
import { motion, useAnimationControls } from "framer-motion";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import SplitText from "../motion/SplitText";
import HoverRoll from "../motion/hoverRoll";
import {
  badgeHoverEffect,
  badgeWiggleEffect,
  motionTapEffect,
} from "../../helper/motionConfig";

// Shape/sizing follow IntroBadge (src/components/index/bottom.tsx's "From
// Australia with Love" tag) — the pill border/radius live on the outer
// Badge, the type sizing on the inner BadgeText. Colour departs from that
// reference on purpose: IntroBadge is always white/black, but this one uses
// its own fixed accent — green when `forward` (this CTA moves the visitor
// further into the site), white when it doesn't (a "Home"/"Back" link) —
// so it reads as forward-vs-back rather than matching IntroBadge's look.
//
// `isDarkMode` no longer affects this component's own colours — accentColor
// is decided by `forward` alone now. It's kept purely to pass
// through to `routeTo` below, which still needs it to pick the right
// page-transition overlay colour.
//
// Animation: whileHover (badgeHoverEffect) covers a slight grow that holds
// for the whole hover and the outline -> solid-fill colour invert (border/
// icon track `currentColor` so they invert for free). The one-shot wiggle
// is fired separately, imperatively, via wiggleControls on hover-enter
// (badgeWiggleEffect) rather than through whileHover — whileHover is a
// gesture animation that Framer cancels/reverses the moment the pointer
// leaves, so a quick hover-unhover could catch the rotate keyframes
// mid-flight and leave the badge stuck on a tilt. Driving it through
// `animate` instead means it always plays to completion. whileTap reuses
// NavCircle/BackCircle's motionTapEffect for the press feedback. The label
// separately gets a SplitText + HoverRoll per-character hover roll.
//
// `invertOnly` strips all of that back down to just the colour invert — no
// grow, no wiggle, no tap scale, no SplitText/HoverRoll — for pages that
// want the badge visually present but calmer (acknowledgement.tsx, by
// explicit request: that page's tone doesn't suit the playful hover).
const PillCallToAction = ({
  name,
  tagId,
  tagIdStartNum,
  forward,
  setHover,
  route,
  isDarkMode = true,
  manualCursor = false,
  invertOnly = false,
}: {
  name: string;
  tagId: string;
  tagIdStartNum: number;
  forward: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  route: Route;
  isDarkMode?: boolean;
  manualCursor?: boolean;
  invertOnly?: boolean;
}) => {
  const accentColor = forward ? Color.BRIGHT_GREEN : Color.WHITE;
  const wiggleControls = useAnimationControls();

  return (
    <Badge
      id={`${tagId}_${tagIdStartNum}`}
      $accentColor={accentColor}
      animate={wiggleControls}
      whileHover={
        invertOnly
          ? {
              backgroundColor: accentColor,
              color: Color.BLACK,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }
          : badgeHoverEffect(accentColor, Color.BLACK)
      }
      whileTap={invertOnly ? undefined : motionTapEffect}
      onMouseEnter={() => {
        setHover(true);
        if (!invertOnly) wiggleControls.start(badgeWiggleEffect);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={route}
        className={manualCursor ? "cursor-pointer" : "cursor-none"}
        onClick={(e) => routeTo(e, route, isDarkMode)}
      >
        <BadgeText
          id={`${tagId}_${tagIdStartNum + 2}`}
          className="font-secondary-normal select-none"
        >
          {!forward && (
            <FontAwesomeIcon
              id={`${tagId}_${tagIdStartNum + 1}`}
              icon={faChevronLeft}
              size="sm"
              className="mr-2"
            />
          )}
          {invertOnly ? (
            <h3>{name}</h3>
          ) : (
            <SplitText as="h3" className="split-fast">
              <HoverRoll>{name}</HoverRoll>
            </SplitText>
          )}
          {forward && (
            <FontAwesomeIcon
              id={`${tagId}_${tagIdStartNum + 3}`}
              icon={faChevronRight}
              size="sm"
              className="ml-2"
            />
          )}
        </BadgeText>
      </a>
    </Badge>
  );
};

export default PillCallToAction;

const Badge = styled(motion.div)<{ $accentColor: Color }>`
  width: fit-content;
  padding: 7px 15px;
  border-radius: 999px;
  background-color: transparent;
  border: 2.5px solid currentColor;
  color: ${({ $accentColor }) => $accentColor};
`;

const BadgeText = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;

  @media ${layout.up.sm} {
    font-size: 18px;
  }

  @media ${layout.up.xxl} {
    font-size: 20px;
  }
`;
