import React from "react";
import Route from "../../routes/route";
import NavCircle from "./navCircle";
import BackCircle from "./backCircle";

// The bottom-right nav pair every gallery page (experience/projects/
// education) renders: NavCircle (forward) + BackCircle (back). Bundled
// here so pages don't each re-declare the state that connects the two
// circles' hover reactions — `circleHover` (who's hovered) and
// `pointerPos` (live cursor position, for BackCircle's chevron lean) — see
// backCircle.tsx/navCircle.tsx for what that wiring actually drives, and
// pill-cta-hierarchy.md memory for the design history behind it.
//
// NavCircle fades in first, BackCircle 0.1s after — a settled design
// decision, not left for each page to reproduce, so it's baked into
// `delay` here rather than exposed as two separate props.
const NavCluster = ({
  isDarkMode = true,
  setHover,
  delay = 0.5,
  backRoute,
  backTagId,
  onBackClick,
  forwardRoute,
  forwardTagId,
  forwardImage,
  forwardAlt,
  onForwardClick,
}: {
  isDarkMode?: boolean;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  // NavCircle's entrance delay; BackCircle's is derived as delay + 0.1.
  delay?: number;
  backRoute: Route;
  backTagId: string;
  // Optional side effect to run before navigating — e.g. setting the
  // page-transition overlay color when that destination's background
  // depends on isDarkMode. Omit when the destination is unconditionally
  // one color (see routeTo.ts) and the default transition color already
  // matches it.
  onBackClick?: () => void;
  forwardRoute: Route;
  forwardTagId: string;
  forwardImage: string;
  forwardAlt: string;
  onForwardClick?: () => void;
}) => {
  const [circleHover, setCircleHover] = React.useState<
    "back" | "forward" | null
  >(null);
  const [pointerPos, setPointerPos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <>
      <div onClick={onBackClick}>
        <BackCircle
          route={backRoute}
          tagId={backTagId}
          isDarkMode={isDarkMode}
          setHover={setHover}
          delay={delay + 0.1}
          partnerHover={circleHover === "forward"}
          onHoverChange={(hovering) => {
            setCircleHover(hovering ? "back" : null);
            if (!hovering) setPointerPos(null);
          }}
          pointerPosition={pointerPos}
          onPointerMove={(x, y) => setPointerPos({ x, y })}
        />
      </div>
      <div id={`${forwardTagId}_0`} onClick={onForwardClick}>
        <NavCircle
          image={forwardImage}
          alt={forwardAlt}
          tagId={forwardTagId}
          route={forwardRoute}
          isDarkMode={isDarkMode}
          setHover={setHover}
          delay={delay}
          partnerHover={circleHover === "back"}
          onHoverChange={(hovering) => {
            setCircleHover(hovering ? "forward" : null);
            if (!hovering) setPointerPos(null);
          }}
          onPointerMove={(x, y) => setPointerPos({ x, y })}
        />
      </div>
    </>
  );
};

export default NavCluster;
