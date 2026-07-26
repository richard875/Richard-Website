import React from "react";
import { useAnimationControls } from "framer-motion";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "../../enums/color";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import SplitText from "../motion/splitText";
import HoverRoll from "../motion/hoverRoll";
import { Badge, BadgeText } from "./pillBadge";
import {
  badgeHoverEffect,
  badgeWiggleEffect,
  motionTapEffect,
} from "../../helper/motionConfig";

// Shape/sizing follow IntroBadge (src/components/index/bottom.tsx's "From
// Australia with Love" tag) — the pill border/radius live on the outer
// Badge, the type sizing on the inner BadgeText (both shared with
// ProjectLink via ./pillBadge.tsx, since they render the exact same
// treatment). Colour departs from that reference on purpose: IntroBadge is
// always white/black, but this one uses its own accent — green when
// `forward` (this CTA moves the visitor further into the site), white/black
// when it doesn't (a "Home"/"Back" link) — so it reads as forward-vs-back
// rather than matching IntroBadge's look.
//
// `isDarkMode` picks the right shade for both variants so the pill stays
// legible against either background: BRIGHT_GREEN/WHITE on dark backgrounds,
// DIM_GREEN/BLACK on light ones (BRIGHT_GREEN's contrast against a light
// page is too low to read). It's also passed through to `routeTo` below,
// which needs it to pick the right page-transition overlay colour.
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
  const forwardAccentColor = isDarkMode ? Color.BRIGHT_GREEN : Color.DIM_GREEN;
  const backAccentColor = isDarkMode ? Color.WHITE : Color.BLACK;
  const accentColor = forward ? forwardAccentColor : backAccentColor;
  const hoverTextColor =
    accentColor === Color.BLACK ? Color.WHITE : Color.BLACK;
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
              color: hoverTextColor,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }
          : badgeHoverEffect(accentColor, hoverTextColor)
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
