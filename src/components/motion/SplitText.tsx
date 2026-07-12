import React from "react";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * SplitText — the site's text reveal.
 *
 * Splits its text into individual characters (via Splitting.js) and fades +
 * rises each one a touch, staggered by character index, the instant it scrolls
 * into view. Fast and light — the styling lives in `.split-fade-in` (global.scss)
 * so every reveal across the site shares one timing curve.
 *
 * Robustness notes:
 *   • The hidden state is applied through the JS-added `.split-ready` class, so
 *     text renders visible without JavaScript (crawlers / no-script).
 *   • `split-ready` is added synchronously in a layout effect *before* the
 *     async split resolves, so there's no flash of fully-visible text.
 *   • The reveal itself is a paused `@keyframes` animation, not a `transition`
 *     — see global.scss for why (transitions can silently no-op when this
 *     element sits inside a GSAP ScrollTrigger pin).
 *   • `prefers-reduced-motion` returns the plain, static string.
 *
 * Pass `delay` (seconds) to push the whole run later — used on the home hero so
 * the text rides in just as the landing splash lifts away.
 */
type SplitTextProps = {
  /**
   * Text to reveal. Plain strings are safest (stable identity → never
   * re-renders). Rich nodes (inline links, coloured spans) also work —
   * Splitting.js splits the text inside them while preserving the elements —
   * but pass *stable* nodes (e.g. via `useMemo`) so a parent re-render can't
   * wipe the split DOM.
   */
  children: React.ReactNode;
  /** Element/component to render — `p`, `span`, `h1`, a styled component, … */
  as?: React.ElementType;
  className?: string;
  /** Seconds to wait before the first character begins. */
  delay?: number;
  /** Re-run every time it enters the viewport, or just once. */
  once?: boolean;
  /** Fraction of the element visible before it triggers. */
  amount?: number;
  style?: React.CSSProperties;
};

const SplitText = ({
  children,
  as = "span",
  className,
  delay = 0,
  once = true,
  amount = 0.1,
  style,
}: SplitTextProps) => {
  const prefersReduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    // Hide before paint so there's no flash while the async split lands.
    el.classList.add("split-ready");

    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    import("splitting").then(({ default: Splitting }) => {
      if (cancelled || !el) return;

      // Splitting.js trims every text node, which swallows the whitespace
      // around inline elements (styled words, links) — "from Sydney" becomes
      // "fromSydney". Record which direct-child boundaries carry whitespace
      // before the split, then restore a non-breaking space at each one after.
      const spaceBefore: Element[] = [];
      const spaceAfter: Element[] = [];
      Array.from(el.children).forEach((child) => {
        const prev = child.previousSibling;
        const next = child.nextSibling;
        const text = child.textContent || "";
        if (
          (prev?.nodeType === Node.TEXT_NODE &&
            /\s$/.test(prev.textContent || "")) ||
          /^\s/.test(text)
        )
          spaceBefore.push(child);
        if (
          (next?.nodeType === Node.TEXT_NODE &&
            /^\s/.test(next.textContent || "")) ||
          /\s$/.test(text)
        )
          spaceAfter.push(child);
      });

      Splitting({ target: el, by: "chars" });

      spaceBefore.forEach((child) =>
        el.insertBefore(document.createTextNode(" "), child),
      );
      spaceAfter.forEach((child) =>
        el.insertBefore(document.createTextNode(" "), child.nextSibling),
      );

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add("is-inview");
              if (once) observer?.unobserve(el);
            } else if (!once) {
              el.classList.remove("is-inview");
            }
          });
        },
        { threshold: amount },
      );
      observer.observe(el);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
    // Runs once per mount: re-splitting on every render would fight React's
    // reconciliation and wipe the character spans. Content here is static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  // `any` so an arbitrary element/component accepts ref/className/style/children.
  const Tag: any = as;

  if (prefersReduced) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={["split-fade-in", className].filter(Boolean).join(" ")}
      style={
        delay
          ? ({ ...style, "--split-delay": `${delay}s` } as React.CSSProperties)
          : style
      }
    >
      {children}
    </Tag>
  );
};

export default React.memo(SplitText);
