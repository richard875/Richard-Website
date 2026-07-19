import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import Magnetic from "../motion/Magnetic";
import {
  backCircleButtonEffect,
  motionTapEffect,
} from "../../helper/motionConfig";

// The "go back" counterpart to NavCircle's (src/components/global/
// navCircle.tsx) "go forward" action — a small white badge that sits
// partially behind NavCircle's top-left edge (see the `right`/`bottom`
// formulas below for exactly how much). Skips the `Magnetic` cursor-follow
// wrapper NavCircle/ResumeCircle use — this is a secondary action and
// shouldn't compete with the primary circle's pull.
//
// The chevron leans toward wherever the cursor currently is, whether that's
// over this circle or over NavCircle — `pointerPosition` carries the shared
// live cursor position, `onPointerMove` reports this circle's own share of
// it. `partnerHover`/`onHoverChange` is a separate channel that drives the
// nudge/glow reaction to the sibling circle being hovered — see
// navCircle.tsx's own copy of both prop pairs for the other half. See
// pill-cta-hierarchy.md memory for the fuller design history/iteration
// log — kept out of this file so the comments describe current behavior,
// not a changelog.
const BackCircle = ({
  route,
  tagId,
  isDarkMode = true,
  setHover,
  delay = 0.4,
  partnerHover = false,
  onHoverChange,
  pointerPosition = null,
  onPointerMove,
}: {
  route: Route;
  tagId: string;
  isDarkMode?: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  delay?: number;
  // True while the paired NavCircle is hovered.
  partnerHover?: boolean;
  onHoverChange?: (hovering: boolean) => void;
  // Live cursor position while either this circle or NavCircle is hovered,
  // null once neither is. Drives the chevron's lean — see below.
  pointerPosition?: { x: number; y: number } | null;
  onPointerMove?: (x: number, y: number) => void;
}) => {
  const circleRef = React.useRef<HTMLDivElement>(null);
  const [chevronTilt, setChevronTilt] = React.useState(0);

  React.useEffect(() => {
    const el = circleRef.current;
    if (!pointerPosition || !el) {
      setChevronTilt(0);
      return;
    }
    const rect = el.getBoundingClientRect();
    const dx = pointerPosition.x - (rect.left + rect.width / 2);
    const dy = pointerPosition.y - (rect.top + rect.height / 2);
    // atan2(dy, -dx) reads 0° when the cursor is directly left of center —
    // the chevron's own resting direction — so this is the chevron's
    // deviation from "business as usual", not a raw compass bearing.
    // Damped hard (×0.15, clamped ±18°) so it reads as a lean, not a spin.
    const angle = Math.atan2(dy, -dx) * (180 / Math.PI);
    setChevronTilt(Math.max(-18, Math.min(18, angle * 0.15)));
  }, [pointerPosition]);

  return (
    <Wrapper>
      <Magnetic strength={0.2}>
        <motion.div
          whileHover={backCircleButtonEffect}
          whileTap={motionTapEffect}
          className="w-fit"
        >
          <Circle
            ref={circleRef}
            id={`${tagId}_0`}
            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 3,
              x: partnerHover ? 6 : 0,
              y: partnerHover ? 6 : 0,
              boxShadow: partnerHover
                ? [
                    "0 0 0 0px rgba(53, 190, 39, 0.45)",
                    "0 0 0 12px rgba(53, 190, 39, 0)",
                  ]
                : "0 0 0 0px rgba(53, 190, 39, 0)",
            }}
            transition={{
              opacity: { duration: 0.6, delay, ease: [0, 0.71, 0.2, 1.01] },
              scale: { duration: 0.6, delay, ease: [0, 0.71, 0.2, 1.01] },
              rotate: { duration: 0.6, delay, ease: [0, 0.71, 0.2, 1.01] },
              x: { type: "spring", stiffness: 300, damping: 22 },
              y: { type: "spring", stiffness: 300, damping: 22 },
              boxShadow: partnerHover
                ? { duration: 1.2, repeat: Infinity, ease: "easeOut" }
                : { duration: 0.3 },
            }}
            onClick={(e) => routeTo(e, route, isDarkMode)}
            onMouseMove={(e) => onPointerMove?.(e.clientX, e.clientY)}
            onMouseEnter={() => {
              setHover(true);
              onHoverChange?.(true);
            }}
            onMouseLeave={() => {
              setHover(false);
              onHoverChange?.(false);
            }}
          >
            <motion.div
              className="flex"
              animate={{ rotate: chevronTilt }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <FontAwesomeIcon id={`${tagId}_1`} icon={faArrowLeft} />
            </motion.div>
          </Circle>
        </motion.div>
      </Magnetic>
    </Wrapper>
  );
};

export default BackCircle;

// right/bottom put this circle's *center* at distance D = navRadius +
// 0.5×thisRadius from NavCircle's own center, along the up-left diagonal —
// i.e. past NavCircle's circumference (D = navRadius would sit exactly ON
// it, ~50% covered; this pushes 0.5 of BackCircle's own radius further out,
// ~17% covered by the raw circle-intersection math — though the perceived
// hidden area has consistently read as *more* than the math suggests at
// this scale, so don't use the raw percentage alone to judge "is this too
// much/little," check against what's actually rendered). Was 0.3 (~27%
// covered) before the user asked to push it out further. Don't go back to
// the plain "center on the circumference" formula (right = navRight +
// navWidth×0.8536 − thisWidth/2, i.e. an implicit 0-past-circumference
// offset) — that one hid most of the circle at this size, which is what
// started this whole adjustment. Expanded out:
//   right = navRight + navWidth×0.8536 − thisWidth×0.3232
//   (0.8536 = 1/2 + 1/(2√2), 0.3232 = 1/2 − 0.5/(2√2))
// bottom is symmetric (NavCircle is square, its width doubles as height).
// Base navRight=28/navWidth=130, sm=40/150, lg=56/170 — move BackCircle's
// numbers in lockstep if NavCircle's ever change, and re-derive from the
// formula above (not by eyeballing) if this circle's own size or the 0.5
// factor changes again.
//
// z-index is one below NavCircle's 9999 — NavCircle always paints on top
// where the two overlap, by explicit user request. Known, accepted
// trade-off: NavCircle has no clip-path of its own, so its full square (not
// just its drawn circle) wins hit-testing anywhere it overlaps BackCircle,
// including NavCircle's own visually-empty corner — smaller now that the
// overlap itself shrank, but still present. A real fix means threading
// clip-path through Magnetic's cursor-tracking span (risky — shared with
// ResumeCircle, a botched pointer-events change there kills magnetic-pull
// entirely) or pulling the circles apart (not asked for) — leave it.
const Wrapper = styled.div`
  position: fixed;
  right: 120px;
  bottom: 120px;
  z-index: 9998;
  pointer-events: none;

  @media ${layout.up.sm} {
    right: 146px;
    bottom: 146px;
  }

  @media ${layout.up.lg} {
    right: 177px;
    bottom: 177px;
  }
`;

const Circle = styled(motion.div)`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: auto;
  border-radius: 199px;
  clip-path: circle(50%);
  border: 2.5px solid ${Color.BLACK};
  background: ${Color.WHITE};
  color: ${Color.BLACK};
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.25));
  font-size: 22px;

  @media ${layout.up.sm} {
    width: 68px;
    height: 68px;
    font-size: 25px;
  }

  @media ${layout.up.lg} {
    width: 76px;
    height: 76px;
    font-size: 28px;
  }
`;
