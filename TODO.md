# TODO

Known issues and improvement opportunities not yet acted on, surfaced by a full repo audit on 2026-08-11. Not urgent, not blocking — just tracked so they don't get lost.

## Worth fixing

- [ ] **`indexNowPostBuild.ts` has no top-level error handling.** Unlike [`googlePostBuild.ts`](src/scripts/googlePostBuild.ts), which wraps its body in try/catch and degrades to a warning on failure, [`indexNowPostBuild.ts`](src/scripts/indexNowPostBuild.ts) has no such guard around its own logic (only the HTTP calls inside `safeRequest.ts` are caught). Anything else that throws in there — e.g. `fs.writeFileSync` failing — propagates uncaught out of `onPostBuild` in `gatsby-node.ts` and fails the entire production build for what's meant to be a best-effort indexing side task.

- [ ] **Circular nav controls aren't keyboard-operable.** [`navCircle.tsx`](src/components/global/navCircle.tsx), [`backCircle.tsx`](src/components/global/backCircle.tsx), and [`resumeCircle.tsx`](src/components/global/resumeCircle.tsx) are bare `styled(motion.div)` elements with only `onClick`/`onMouseEnter`/`onMouseLeave`/`onMouseMove` handlers — no `href`, `role`, `tabIndex`, or `onKeyDown`. Every other nav link in the codebase (`links.tsx`, `footerLeft.tsx`, `top.tsx`, `RoundedCallToAction`, `PillCallToAction`) correctly wraps a real `<a href>`. A keyboard-only visitor can't tab to or activate any of these three (WCAG 2.1.1 / 4.1.2).

- [ ] **Reduced-motion preference is only wired into 3 of the site's motion primitives.** [`usePrefersReducedMotion`](src/hooks/usePrefersReducedMotion.ts) is consulted by `splitText.tsx`, `hoverRoll.tsx`, and `magnetic.tsx`, but not by the GSAP `ScrollTrigger` pinned horizontal-scroll on `/experience` and `/projects` (`scrub: 1`, runs regardless of OS setting), or the Sydney Opera House WebGL scene's continuous auto-rotate and floating bob on `/intro` (`src/components/soh/`). Framer-motion's `MotionConfig reducedMotion="user"` in `gatsby-browser.js` covers framer-motion-driven animation only, not GSAP or raw `useFrame` loops.

## Minor / nice-to-have

- [ ] **Loose `any` types.** `MetaImage: any` in [`metaTags.tsx`](src/components/seo/metaTags.tsx), `children: any` in [`splash.tsx`](src/components/seo/splash.tsx), plus `initialTransition.tsx` and `splitText.tsx`. None are load-bearing, just typing that could be tightened.

- [ ] **JSON-LD `Person.sameAs` includes the entity's own page URL.** In `metaTags.tsx`, the `Person`'s `url` (the current page) is also duplicated inside its own `sameAs` array, which is conventionally for external profile links rather than self-references. Not broken, just an unconventional way to model it — worth a second look if the JSON-LD graph gets revisited.

- [ ] **No React error boundary anywhere in the tree.** A render exception (e.g. in the Three.js scene on `/intro`) would currently produce a blank page with no fallback UI.
