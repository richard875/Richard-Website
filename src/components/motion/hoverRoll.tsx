import React from "react";
import gsap from "gsap";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * HoverRoll — per-character hover reveal for a word that has to stay
 * INSIDE an ancestor SplitText's own single continuous entrance cascade,
 * instead of getting its own separate reveal. Front character rolls up and
 * out, a back copy rolls up into its place, staggered left to right — so
 * there's always legible text on screen, never a gap where the link goes
 * blank mid-transition.
 *
 * It can't do its own text split (that's how a standalone hover-roll word
 * would normally work) — doing so would mean nesting a second split inside
 * SplitText's own Splitting.js pass, which would try to re-split the
 * already-split spans. So this component takes the opposite approach: it
 * renders `children` as plain content (so Splitting.js treats it exactly
 * like every other word in the paragraph for entrance purposes), then
 * *enhances* the `.char` spans Splitting.js produces once they exist —
 * wrapping each in a clipping box and adding a hidden aria-hidden duplicate
 * behind it to form the front/back pair, grafted onto DOM Splitting.js
 * already built rather than DOM this component builds itself.
 *
 * Splitting.js runs asynchronously (SplitText dynamically imports it), so
 * there's no fixed delay to wait out — a MutationObserver watches for the
 * `.char` spans to appear and enhances them the moment they do. Splitting's
 * own CSS (splitting.css, imported globally) already makes `.char`
 * `display: inline-block` — required for `transform` to affect it at all,
 * since it has no effect on a plain `display: inline` element — so no
 * extra work is needed there.
 *
 * The clipping/positioning wrapper is a *new* element inserted around each
 * `.char`, not `.char` itself: an element can't provide a stable clip
 * boundary for its own transform (the clip region moves with the element
 * it's attached to), so the piece that stays static while front/back move
 * through it has to be a separate ancestor.
 *
 * The back-face clone has its `char` class stripped so it doesn't also
 * pick up SplitText's own entrance animation (that CSS targets `.char`
 * specifically) — without that, the hidden copy would fight the reveal
 * animation for control of the same `transform` property.
 *
 * `front` keeps its `char` class, so SplitText's entrance animation plays
 * on it normally — but that CSS animation uses `animation-fill-mode: both`,
 * which means it never lets go of `transform` once it starts, even after
 * it finishes: a CSS animation's computed value for a property beats an
 * inline style (or GSAP, which just sets inline styles) for as long as the
 * animation is attached, fill-mode or not. Left alone, this makes `front`
 * permanently untransformable — confirmed directly, not assumed: setting
 * `transform` on it by hand had zero visible effect. Once the entrance
 * animation actually finishes (`animationend`), `front.style.animation` is
 * set to `"none"`, detaching it — after that, GSAP controls `transform`
 * normally for the hover roll.
 */
// Timing/ease matches landonorris.com's own [data-anim="text-hover"] handler.
const HOVER_DURATION = 0.6;
const HOVER_STAGGER = 0.02;
const HOVER_EASE = "power3.out";

type HoverRollProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Seconds between one character starting its roll and the next one
   * starting — independent of how long each character's own roll takes
   * (that's fixed at HOVER_DURATION). Tighten this per-instance for longer
   * strings (e.g. an email address) so the whole cascade doesn't drag.
   */
  stagger?: number;
  /** Fires the instant a roll (in either direction) begins. */
  onRollStart?: () => void;
  /** Fires once every character's roll has finished — not per character. */
  onRollComplete?: () => void;
};

const HoverRoll = ({
  children,
  className,
  stagger = HOVER_STAGGER,
  onRollStart,
  onRollComplete,
}: HoverRollProps) => {
  const prefersReduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const frontsRef = React.useRef<HTMLElement[]>([]);
  const backsRef = React.useRef<HTMLElement[]>([]);
  const rollCompleteRef = React.useRef<gsap.core.Tween | null>(null);

  React.useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const enhance = () => {
      const chars = Array.from(el.querySelectorAll<HTMLElement>(".char"));
      if (!chars.length || cancelled) return false;

      const fronts: HTMLElement[] = [];
      const backs: HTMLElement[] = [];

      chars.forEach((front) => {
        front.addEventListener(
          "animationend",
          () => {
            front.style.animation = "none";
          },
          { once: true },
        );

        // inline-flex, not inline-block: an inline-block whose overflow is
        // anything but visible takes its baseline from its bottom margin
        // edge instead of its text baseline (CSS2.1 10.8.1), which is what
        // was pushing this text above the surrounding line. An inline-flex
        // container doesn't have that carve-out — its baseline still comes
        // from its baseline-aligned flex item (front's own text baseline).
        // line-height: 1.2 matches BwGradual-Medium's own font metrics
        // (hhea/OS-2 ascent 0.97em + descent 0.23em = 1.2em), tightening
        // front/back's inherited line-height down to the font's natural
        // height so the y:100% swap travels only as far as it has to
        // instead of the ambient paragraph line-height's full gap.
        const wrapper = document.createElement("span");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "baseline";
        wrapper.style.overflow = "hidden";
        wrapper.style.lineHeight = "1.2";
        front.parentNode?.insertBefore(wrapper, front);
        wrapper.appendChild(front);

        const back = front.cloneNode(true) as HTMLElement;
        back.classList.remove("char");
        back.setAttribute("aria-hidden", "true");
        back.style.position = "absolute";
        back.style.top = "0";
        back.style.left = "0";
        wrapper.appendChild(back);

        fronts.push(front);
        backs.push(back);
      });

      frontsRef.current = fronts;
      backsRef.current = backs;
      // Resting state for the hover mechanism: the back face waits one
      // line-height below, clipped out of sight by the wrapper's
      // overflow:hidden.
      gsap.set(backs, { y: "100%" });
      return true;
    };

    if (enhance()) return;

    const observer = new MutationObserver(() => {
      if (!cancelled && enhance()) observer.disconnect();
    });
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      gsap.killTweensOf([...frontsRef.current, ...backsRef.current]);
      rollCompleteRef.current?.kill();
    };
  }, [prefersReduced]);

  const animate = (hovered: boolean) => {
    if (prefersReduced) return;
    const fronts = frontsRef.current;
    const backs = backsRef.current;
    if (!fronts.length) return;

    // Killed and rescheduled on every call rather than driven off the
    // fronts tween's own onComplete: with a staggered array target, GSAP
    // fires that callback once per character rather than once for the
    // whole roll, so it can't tell "the last character finished" from "a
    // character finished". A delayedCall sized to the roll's total
    // duration (last character's stagger offset + its own duration) gives
    // a single, reliable "whole roll settled" signal instead — and killing
    // any pending one here means a roll interrupted mid-flight (rapid
    // in/out) can't fire a stale onRollComplete after a newer roll has
    // already taken over.
    rollCompleteRef.current?.kill();
    onRollStart?.();
    rollCompleteRef.current = gsap.delayedCall(
      HOVER_DURATION + stagger * (fronts.length - 1),
      () => onRollComplete?.(),
    );

    // Fresh gsap.to calls (not a reversed timeline) so leaving cascades the
    // same left-to-right direction as entering. overwrite: "auto" keeps
    // rapid in/out flicks smooth by taking over from each character's
    // current position instead of restarting.
    gsap.to(fronts, {
      y: hovered ? "-100%" : "0%",
      duration: HOVER_DURATION,
      ease: HOVER_EASE,
      stagger,
      overwrite: "auto",
    });
    gsap.to(backs, {
      y: hovered ? "0%" : "100%",
      duration: HOVER_DURATION,
      ease: HOVER_EASE,
      stagger,
      overwrite: "auto",
    });
  };

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={() => animate(true)}
      onMouseLeave={() => animate(false)}
    >
      {children}
    </span>
  );
};

export default HoverRoll;
