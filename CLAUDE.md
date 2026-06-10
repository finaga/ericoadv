# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A brand microsite for **Erico Advogados**, a boutique litigation firm in Brasília. Core practice: **strategic litigation before the higher courts (STF / STJ)**, with arbitration as a complementary layer. (The early research framed it as an arbitration firm — that framing is superseded; lead with the Superior Courts.) The repo holds two things at once:

1. **The public site** — `Web/site.html`, a single-page firm site. This is the primary deliverable and where most work happens.
2. **A project hub + brand deliverables** — `Web/index.html` is a "Marca & Estratégia" landing that links to the strategy brief, the brand manual, and the site.

**Approval vs. production — read this first.** `ericoadv.vercel.app` is an **approval/staging space** where the client reviews work; it is deliberately kept **out of search**. The site's real home will be **erico.law** (that domain still serves the *old* site today). This distinction drives the `noindex` setup and the launch checklist below.

- **Approval URL:** https://ericoadv.vercel.app · **GitHub:** https://github.com/finaga/ericoadv
- Client: Erico Carvalho · Designer: Andre Finageiv · Language: Brazilian Portuguese (`lang="pt-BR"`).

## Stack & layout

Plain HTML + embedded CSS + a little vanilla JS. **No build step, no framework, no dependencies.** Each deployed page is a self-contained file in `Web/` (all CSS in a `<style>` in the head, all JS in one inline `<script>`).

| File | Role |
|------|------|
| `Web/site.html` | **The firm site.** Single page; the main deliverable. |
| `Web/v2.html` | **Alternative concept "Edição Noturna"** (Jun 2026) — cinematic dark-first version of the same single page, same copy/assets verbatim. GSAP 3.12 + ScrollTrigger + Lenis + Three.js r149 via CDN (the only pages with JS libs; everything else stays dependency-free). WebGL navy-duotone hero (offscreen-canvas → `CanvasTexture` upload — direct `<img>` textures fail on some GL stacks), Lenis smooth scroll, scroll-morphing body background (sombra → azul → concreto), pinned horizontal Publicações gallery (≥901px; swipe rail below), char-split hero (word-wrapped spans — char spans alone break mid-word), custom cursor, magnetic contact CTA. All motion behind `prefers-reduced-motion`; no-JS/no-GSAP fallbacks show full content. Hero type is `clamp(34px, 5.25vw, 76px)` — char-split Syne 800 measures ~6% wider than normal text (kerning lost); 76px is the one-line-per-statement ceiling at 1440. |
| `Web/index.html` | Project hub. Its card 03 ("O Site") links to `site.html`. |
| `Web/estrategia.html` | Pre-design research / strategy brief (source: `MARKET-RESEARCH.md`). |
| `Web/guideline.html` | Brand manual. ~700 KB with base64-embedded assets — don't read it whole; grep it. |
| `Web/downloads.html` | **Brand-asset download page.** Buttons serve the deliverable files in `Web/downloads/` (cards, brand-manual PDF, fonts zip, LinkedIn cover, letterhead `.docx`, PPTX templates, logos). Linked from `index.html`. |
| `Web/downloads/` | The deployed deliverable files themselves. Note the **renamed-copy convention**: source assets are copied in under stable `erico-…` names (e.g. `assets/Deliverables/Cartoes/B-Frente.pdf` → `downloads/erico-cartao-frente.pdf`). Includes a `logos/` subfolder (~60 logo variants). To update a deliverable, copy the new source over the matching `erico-…` file — don't change the filename the page links to. |
| `Web/assets/` | Logo + symbol PNGs (navy + inverse/cream variants) and site photos (`bg-hero`, `bg-modernista`, `erico-retrato`). |
| `Web/robots.txt`, `Web/sitemap.xml` | Launch-ready for erico.law (see indexing below). |

### Routing & indexing (`vercel.json`)
- **Rewrites** serve everything under `Web/` at the domain root via a single catch-all: `/` → `Web/index.html`, and `/:path*` → `/Web/:path*` (so `/site.html`, `/downloads.html`, `/assets/*`, `/downloads/*` all resolve with no per-file config).
- **Headers** apply `X-Robots-Tag: noindex, nofollow` **scoped by host to `ericoadv.vercel.app`**. This keeps the approval domain out of Google while leaving erico.law (a different host) indexable with zero edits.

## Deploying

```bash
git add Web/ vercel.json
git commit -m "description"
git push origin main   # Vercel auto-deploys in ~30s
```

Claude sessions usually run on a `claude/…` branch with `main` checked out in a sibling worktree (`/Projects/Erico Adv`), so you can't `git checkout main` here — commit on the session branch and push with **`git push origin HEAD:main`** (the branch already tracks `origin/main`).

**Only `Web/`, `vercel.json`, `CLAUDE.md`, and `README.md` are tracked** (~94 files, most of them the brand deliverables under `Web/downloads/`). Everything else at the repo root is intentionally untracked and **confidential** — `proposta-erico-advogados.*` (contains pricing), `MARKET-RESEARCH.md`, `Docs/`, `PPT/`, `Brand — Erico.pdf`, `assets/` (source images). **Never `git add .`** — stage `Web/` and `vercel.json` explicitly.

## Local preview — environment caveat

This repo lives under a Dropbox **CloudStorage** path the Claude preview/dev-server runner cannot `chdir`/`getcwd` into (macOS TCC → `python3 -m http.server` crashes on `os.getcwd()`). On a normal machine `cd Web && python3 -m http.server 4321` works fine. Inside Claude:

1. Copy the deploy folder out of CloudStorage: `cp -R Web/. /tmp/erico-adv-web/`
2. Point `.claude/launch.json` at `cd /tmp/erico-adv-web && exec python3 -m http.server 4321`, then `preview_start`.
3. **Re-copy after every edit** (`cp Web/site.html /tmp/erico-adv-web/`) and reload.

Gotcha: in that headless preview, programmatic `scrollTo` doesn't fire scroll events or repaint screenshots when scrolled — verify scroll-dependent behavior by dispatching a real `scroll` event and reading the DOM, not by screenshotting a scrolled position. **To screenshot a lower section**, set `document.documentElement.style.scrollBehavior='auto'` then `el.scrollIntoView({block:'start'})` (and force-reveal: add `.in-view` to all `[data-reveal]`) — that *does* position + repaint, unlike `scrollTo`. (Also in project memory.)

## `site.html` architecture

Section flow: sticky **nav** → **hero** (full-bleed Niemeyer photo + a left→right "concreto" scrim for text contrast) → **01 Atuação** (STF / STJ / Arbitragem pillars) → **O Modelo** (dark band) → **02 Perfil** → **03 Publicações** → **04 Contato** → footer. A mobile hamburger menu mirrors the nav.

Non-obvious things:

- **Scroll reveals are sweep-based, not `IntersectionObserver`.** `[data-reveal]` elements reveal when their top crosses ~88% of the viewport, computed directly on `scroll`/`resize`/`load`/`hashchange` (no `requestAnimationFrame`). This replaced an observer that left whole sections stuck at `opacity:0` on anchor jumps, restored scroll, and fast loads. **Do not reintroduce an observer-only reveal** — silently-hidden content is the bug it fixes.
- **Type is a tokenized scale in `:root`** (`--fs-display-md`, `--fs-h1…h5`, `--fs-body-lg/sm`) mirroring the Figma "04 — Typography" Foundations — see Brand system. The hero is the one bespoke exception: `clamp(34px, 8.6vw, 69px)` (69, not the token's 72, so "Disputas Complexas." stays on one line on desktop). Every small uppercase label uses the shared `overline` recipe (Inter 500 / 12px / 0.14em) — `.eyebrow`, `.mono-label`, pillar/publication/contact/footer labels.
- **Nav layout**: the links live in `.nav__right`, right-aligned beside the language pill with a 64px (`--space-3xl`) gap. Links are **16px** (legibility / SEO floor — don't shrink them). The burger menu takes over at **≤820px** — *not* the usual 760px breakpoint — specifically so the 16px links never overlap the ERICO wordmark as the viewport narrows. The hero eyebrow drops to 12px on phones (≤620px).
- **03 Publicações is a static list** — `.pub-item` (cover + details per row) with a `:hover` dark-tint + azul bar, like the Atuação pillars. It replaced a scroll-pinned cover-swap whose last cover cropped off; **don't reintroduce the pin.**
- **The wordmark is an inline SVG `<symbol id="brand-wordmark">`**, traced from the PNG, used via `<use>` with `fill: currentColor` so one definition renders navy in the nav and cream in the footer.
- **Loader** counts `00→100` on an eased `requestAnimationFrame` ramp, gated on the hero photo (holds at 90 until the image decodes, so the panel never lifts to a blank hero), then lifts. The language toggle is wired via `[data-lang]`; EN shows an "em breve" toast (English isn't built yet). All motion is `prefers-reduced-motion`-aware.
- It's one large file — prefer **precise string edits / assertion-checked scripts** over rewriting it wholesale.

## Brand system

`site.html`'s `:root` is the canonical token set:

```
--concreto #F3F2EE   --surface #ECEAE4   --sombra / --fg #1A1A19
--fg-secondary #4A4843   --fg-muted #6B6860   --border #DDD9D1   --border-strong #C2BEB4
--azul #00347E   --dourado #B28C4D   --verde #386247   (+ --on-dark-* cream rgba steps)
```

- **`--azul` (#00347E) is the primary accent / action color** — active states, links, and the lead "Tribunais Superiores" headline line. **`--dourado` (#B28C4D) is decorative only** — rules, ticks, section numbers; it fails text contrast (~2.8:1), so never set body copy in it. Concreto/Sombra are the light/dark base pair.
- Type: **Syne** (display, 800/600/500) + **Inter** (body, 400/500/600) — Syne 700 is intentionally **not** loaded. The size/weight scale is tokenized in `:root` from the Figma Foundations: `--fs-display-md` (section titles, 60), `--fs-h1` (48), `--fs-h2` (36), `--fs-h3` (30 — pillar + publication titles), `--fs-h4` (24), `--fs-h5` (20), `--fs-body-lg` (18), body (16), `--fs-body-sm` (14). **Weight per tier: display 800 · h1/h2 600 · h3–h5 500 · body 400/500.** No third typeface.
- **Spacing & radius are tokenized in `:root`** from the Figma "02 — Spacing" / "03 — Radius" Foundations. Spacing: `--space-3xs … --space-5xl` = `2·4·8·12·16·24·32·48·64·96·128`; every component margin / padding / gap snaps to these, **including responsive `clamp()` floors and caps**. Two deliberate rules sit *above* the component scale: (1) **section rhythm is its own layer** — `--section-y` and the dark-band (`.modelo`) vertical padding cap at **160px**, one +32 rung past the scale's 128 max (the top steps 64·96·128·160), applied top **and** bottom so the section-to-section gap is **2×** (≈320px on desktop); (2) the horizontal gutter `--pad` caps at **64** — 96 would narrow the column enough to re-wrap the hero headline. Radius scale is `2·4·8·12·16·48`, but the site is **sharp-cornered by design** (Brasília brutalist "cantos vivos") — the only rounded element is the language pill. The few remaining off-scale values (`10/11/13/14px` nav-link / lang-pill internals) are intentional component micro-paddings.
- Aesthetic: Brasília modernist / Niemeyer — architectural photography, generous negative space, **no legal clichés** (no gavels, scales, handshakes).
- The brand **symbol** fuses the "e" of Erico with Lúcio Costa's Plano Piloto; it is decorative — the **wordmark is the primary signature**.
- **Hard constraint:** don't invent colors, type, spacing, or radius outside these foundations. The one sanctioned extension is the **160px section-rhythm step** (documented above) — section spacing legitimately runs past the component scale's 128 max; everything else snaps to a token.

> Older pages (`index.html`, `guideline.html`) use different token *names* for two accents — `--calor` = gold, `--ceu` = blue — but the same hex values.

## Figma

The brand library **"Erico Law — LIB"** (`fileKey Id01yu8iHw0YBmJv2QJRDM`). The **Foundations frame** (`node-id 2010-3`, sections 01 Colors → 04 Typography) **is readable** via `get_design_context` / `get_screenshot` — it's the source of truth for the color, type, spacing + radius tokens, and `site.html`'s `:root` mirrors it. `use_figma` (write) and FigJam may still be seat-gated; don't burn retries there. Committed fallbacks: tokens in `site.html`'s `:root`, the manual in `guideline.html`, assets in `Web/assets/`. For a Figma-only asset, ask Andre to export it into `Web/assets/`.

## erico.law launch checklist

When the site moves to production, update the hardcoded absolute URLs in `site.html` — `canonical`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `url`/`image` — from `ericoadv.vercel.app` → `erico.law`. The host-scoped `noindex` lifts automatically (different host); `robots.txt` + `sitemap.xml` already target erico.law.

## Reference files (untracked, confidential)

`MARKET-RESEARCH.md`, `ERICO-QUESTIONS.md` / `-PT.md` (positioning questions), `proposta-erico-advogados.md`/`.pdf` (**pricing — keep private**), `Brand — Erico.pdf`, `Docs/`, `PPT/`, `assets/` (source images, incl. `assets/Site Images/`).
