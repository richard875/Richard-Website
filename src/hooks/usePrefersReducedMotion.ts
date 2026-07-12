import React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks the user's OS-level "reduce motion" accessibility preference.
 *
 * Every motion primitive on the site consults this so that people who opt out
 * of animation get an instant, static experience instead of reveals/parallax.
 * Defaults to `false` (motion on) during SSR, then syncs on mount.
 */
const usePrefersReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReduced(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) =>
      setPrefersReduced(event.matches);

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
};

export default usePrefersReducedMotion;
