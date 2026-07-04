# Design Direction — richardeverley.com

_A critique, strategy and roadmap for elevating this portfolio to award-tier quality.
Written July 2026. Benchmarks: slik.com.au, landonorris.com, lenis.dev, darkroom.engineering,
itsoffbrand.com, basement.studio, daybreak.studio, and current Awwwards / SiteInspire / Godly
portfolio winners._

---

## 1. Design critique — where the site stands today

### Strengths (worth keeping)

- **A real point of view exists.** Paper-cream (`#F5EDE3`) + ink black + hard borders is an
  editorial foundation many award sites would kill for. It just isn't pushed far enough.
- **Australian identity.** Sydney time in the footer, the Opera House 3D model, the
  Acknowledgement of Country. These are memorable, personal, and rare. They stay.
- **Technical range is already present** — GSAP, Framer Motion, R3F/Three, custom cursor,
  horizontal scroll. The ingredients of a top-tier site are installed; they're just not
  composed.
- **Real, verifiable credibility**: McDonald's menu boards in 15,000 stores, Qantas, SLIK,
  SMH Impact Report. This is stronger raw material than 95% of dev portfolios — and it's
  currently buried in resume bullet points.

### Weaknesses (what keeps it out of award galleries)

1. **The site is a slideshow, not a narrative.** Seven small viewport-locked pages
   (`/`, `/intro`, `/experience`, `/projects`, `/education`, `/contact`) each hold ~1 screen of
   content. Award-tier portfolios are built around one continuous, choreographed scroll where
   sections hand off to each other. Here, the home page literally sets `overflow: hidden` —
   the scroll, the core medium of web storytelling, is disabled on arrival.
2. **The hero reads as a template.** An animated rainbow gradient box, white text with a
   black text-stroke, FontAwesome chevron buttons, a rounded white "My Experience" pill —
   this is the exact grammar of 2020-era React portfolio starters. Nothing about it could
   only belong to Richard Everley.
3. **Typography is content, not design.** Three fonts (one a free Helvetica knockoff,
   `SansSerifFLF`) used at conservative sizes with default rhythm. No scale system, no
   expressive moments, no variable axes. The name — the single most ownable asset — is set
   at 73–130px with a text-stroke gimmick instead of being the composition.
4. **The content model is a resume, not case studies.** `work.json` / `projects.json` are
   arrays of achievement-bullet sentences with `textHighlight` spans. "Engineered and
   crafted…", "Architected a highly responsive and scalable…" — recruiter language, not
   storytelling. There are no outcomes framed as stories, no media art direction, no
   hierarchy inside a project.
5. **Motion is decorative, not choreographed.** Entry fades and y-slides fire once on mount;
   nothing is scroll-linked except the horizontal slider (which uses `scrub` but presents
   content identically across the whole strip — a spreadsheet on rails). No text reveals, no
   parallax, no section continuity, no easing personality.
6. **Developer-centric tells everywhere**: FontAwesome brand icons, `Utilised: React • AWS
   Lambda • …` bullet strings, Google-tag IDs threaded through JSX, "Skills & Work
   Experience" as a page title. Design-centric sites show craft; this shows tooling.

### Comparison against the benchmark class

| Dimension | SLIK / darkroom / lenis class | This site today |
|---|---|---|
| Structure | One scroll narrative, sections choreographed | 7 disconnected mini-pages |
| Typography | 1–2 families, massive scale range (12px ↔ 12vw), variable axes | 3 families, narrow range, static |
| Motion | Scroll-linked, masked text reveals, eased with intent | Mount-time fades |
| Work presentation | Editorial list / full-bleed case studies with media reveals | Bullet-point columns |
| Identity | A signature interaction you remember | A gradient you've seen before |
| Texture | Grain, hairlines, micro-labels, meta-data as ornament | Solid fills, 3px borders |

---

## 2. Design strategy — "The Sydney Editorial"

**Concept.** Set the portfolio like a broadsheet from a parallel-universe Sydney design
press: ink on paper stock, massive compressed grotesk headlines, hairline rules, meta-data
(coordinates, local time, issue number) used as ornament — then let motion make the paper
feel alive. The Australian identity moves from decoration (gradient, emoji-level references)
to editorial voice.

### Visual identity system

- **Paper & ink.** Keep `#F5EDE3` paper and near-black ink (`#141312`) as the world.
  One accent: **gold** `#F9C41A` — distilled from the current gradient, so the brand DNA
  survives, but now used with restraint (markers, the star, hover states, selection).
- **The Star ✳.** A rotating four/eight-point star mark (a nod to the Southern Cross of the
  Australian flag) becomes the signature motif — list bullets, section markers, the marquee
  separator, the loading mark. Seen once, remembered.
- **Typography.**
  - Display: **Archivo Variable** (width 62–125, weight 100–900). Headlines set
    **Expanded Black, uppercase, tight leading** — a voice this site currently doesn't have.
    One file, every expression.
  - Editorial accent: **Fraunces Italic Variable** (optical size + soft axes) for single
    emphasized words inside grotesk headlines — the grotesk/serif-italic tension that defines
    current award-tier typography.
  - Text/UI: **Bw Gradual** (already licensed, already in repo) — keeps continuity with the
    rest of the site while the display layer changes completely.
  - Micro-labels: Archivo, 11–12px, uppercase, +8% tracking, paired with hairline rules —
    `01 — SELECTED WORK` grammar throughout.
- **Surface.** Film-grain overlay at ~4% opacity, 1px hairlines instead of 3px borders,
  no rounded pills, no drop-shadow cards. Depth comes from layering and motion, not shadows.

### Motion strategy

- **Lenis** smooth scroll as the substrate — motion continuity is what separates the
  benchmark class from everything else.
- **GSAP SplitText** (free since 3.13) line-mask reveals for every headline: lines rise from
  behind hairline masks with `power4.out`, staggered ~80ms.
- **Scroll-linked, not scroll-triggered-once**: the hero name tracks scroll (subtle
  compression/parallax), the star rotates with scroll velocity, work-list media follows the
  cursor with `quickTo` inertia.
- **Choreography rule:** one idea per section, entrances staggered top-to-bottom, exits
  never animated (scroll-away is the exit). `prefers-reduced-motion` collapses everything to
  opacity.

### UX restructure

The home page becomes the narrative spine — a single scroll:

1. **Masthead** — name as the composition (12vw Archivo Expanded Black), role line with a
   Fraunces italic accent, meta row (Sydney coordinates, local time, availability).
2. **Marquee** — the star + wordmark strip; the "fold" of the broadsheet.
3. **Statement** — who Richard is, in 4-word-per-line editorial scale, with the credibility
   (McDonald's × 15,000 stores, Qantas, SLIK) written as a story, not bullets.
4. **Selected Work** — numbered editorial index rows; hover reveals the existing project
   videos floating at the cursor. Rows link into the deep pages.
5. **Experience Index** — the CV as a beautiful table: company / role / years, full-row
   hover inversion. Links to `/experience`.
6. **Colophon footer** — ink-black section: oversized contact CTA, giant email, socials as
   text (no FontAwesome), Acknowledgement of Country given the dignity of real placement,
   Sydney time, back-to-top.

Deep pages (`/experience`, `/projects`, `/contact`, …) remain as chapters; the home page
stops being a door and becomes the magazine.

---

## 3. Roadmap

- **Phase 1 — Foundation + Home (this pass).** Type system, tokens, grain, Lenis,
  the six-section home experience above, cursor kept and refined. Old splash components
  retired.
- **Phase 2 — Case studies.** Replace `projects.json` bullet arrays with a
  story schema (`hook / role / outcome / media[]`), one scroll page per project with
  full-bleed media, parallax, and next-project handoff. The McDonald's/Coates and SMH
  stories lead.
- **Phase 3 — Deep pages restyled.** `/experience`, `/contact`, `/education` adopt the
  editorial system; horizontal scroll on `/projects` either art-directed properly
  (SLIK-style panels with scale) or retired.
- **Phase 4 — Signature tech moment.** Rebuild the Opera House scene as a hero-integrated
  WebGL moment (grain-matched, paper-toned, scroll-orbits) instead of a boxed viewer;
  page-transition system (view-transition or GSAP overlay wipe) for section-to-section
  continuity.

## 4. What was removed, and why

- **Animated rainbow gradient hero** — the single most template-signalling element.
  Its gold survives as the accent color.
- **Text-stroke name treatment** — replaced by scale, weight and width; the stroke was
  doing the job the typeface should do.
- **FontAwesome iconography** — social links become text links; chevrons become typographic
  arrows (→). Icon fonts read "bootstrap", type reads "editorial".
- **`overflow: hidden` home** — the story now happens in scroll, where it belongs.
