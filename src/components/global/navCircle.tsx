import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import Magnetic from "../motion/magnetic";
import {
  mainCircleButtonEffect,
  motionTapEffect,
} from "../../helper/motionConfig";
import ArrowSrc from "../../../static/images/index-circle/arrow.svg";

// Same rotating-circle construction as ResumeCircle (src/components/global/
// resumeCircle.tsx) — green disc, black outline, a spinning text-ring, and a
// static arrow overlay — reused here for page-to-page navigation instead of
// the resume download. The text ring is destination-specific (`image`, from
// static/images/nav-circle) so it's passed as a prop and rendered with a
// plain <img>, not gatsby's <StaticImage>: StaticImage requires a literal
// path at the JSX call site, which a shared component can't offer when the
// image varies per page — see iconPicker.ts for the same constraint/pattern
// elsewhere in this codebase.
//
// Fixed to the bottom-right corner of the viewport at every breakpoint
// (unlike ResumeCircle, which is positioned by its caller) since every
// consumer of this component wants that same placement. z-index is above
// BackCircle's (src/components/global/backCircle.tsx) — this circle always
// wins visually/functionally where the two overlap, by user request.
//
// `partnerHover` drives this circle's half of a two-way "connected cluster"
// bit shared with BackCircle: while BackCircle is hovered, this circle
// nudges toward it — a playful reaction to a sibling's hover, not just its
// own. `onPointerMove` is a separate channel: it just reports this circle's
// live cursor position upward so BackCircle's chevron can lean toward it
// even while the cursor is over NavCircle, not just over BackCircle itself.
const NavCircle = ({
  image,
  alt,
  route,
  tagId,
  isDarkMode = true,
  setHover,
  delay = 0.5,
  partnerHover = false,
  onHoverChange,
  onPointerMove,
}: {
  image: string;
  alt: string;
  route: Route;
  tagId: string;
  isDarkMode?: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  delay?: number;
  // True while the paired BackCircle (src/components/global/backCircle.tsx)
  // is hovered — nudges this circle toward it for a connected-cluster feel.
  partnerHover?: boolean;
  onHoverChange?: (hovering: boolean) => void;
  onPointerMove?: (x: number, y: number) => void;
}) => (
  <Wrapper>
    <Magnetic strength={0.4}>
      <motion.div
        whileHover={mainCircleButtonEffect}
        whileTap={motionTapEffect}
        className="w-fit"
      >
        <CircleContainer
          id={`${tagId}_0`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: partnerHover ? -6 : 0,
            y: partnerHover ? -6 : 0,
          }}
          transition={{
            opacity: { duration: 0.4, delay, ease: [0, 0.71, 0.2, 1.01] },
            scale: { duration: 0.4, delay, ease: [0, 0.71, 0.2, 1.01] },
            x: { type: "spring", stiffness: 300, damping: 22 },
            y: { type: "spring", stiffness: 300, damping: 22 },
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
          <Circle id={`${tagId}_1`}>
            <img
              id={`${tagId}_2`}
              src={image}
              alt={alt}
              className="relative h-5/6 w-5/6 select-none"
              draggable={false}
            />
          </Circle>
          <Arrow id={`${tagId}_3`} src={ArrowSrc} alt="" draggable={false} />
        </CircleContainer>
      </motion.div>
    </Magnetic>
  </Wrapper>
);

export default NavCircle;

const Wrapper = styled.div`
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 9999;

  @media ${layout.up.sm} {
    right: 40px;
    bottom: 40px;
  }

  @media ${layout.up.lg} {
    right: 56px;
    bottom: 56px;
  }
`;

const CircleContainer = styled(motion.div)`
  width: 130px;
  height: 130px;
  user-select: none;
  border-radius: 99px;

  @media ${layout.up.sm} {
    width: 150px;
    height: 150px;
  }

  @media ${layout.up.lg} {
    width: 170px;
    height: 170px;
  }
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 199px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid ${Color.BLACK};
  background: ${Color.BRIGHT_GREEN};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    100% {
      transform: rotate(-360deg);
    }
  }
`;

const Arrow = styled.img`
  position: relative;
  width: 45px;
  left: 42px;
  bottom: 75px;
  user-select: none;

  @media ${layout.up.sm} {
    width: 50px;
    left: 50px;
    bottom: 86px;
  }

  @media ${layout.up.lg} {
    width: 60px;
    left: 55px;
    bottom: 98px;
  }
`;
