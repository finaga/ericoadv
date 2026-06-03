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
| `Web/index.html` | Project hub. Its card 03 ("O Site") links to `site.html`. |
| `Web/estrategia.html` | Pre-design research / strategy brief (source: `MARKET-RESEARCH.md`). |
| `Web/guideline.html` | Brand manual. ~700 KB with base64-embedded assets — don't read it whole; grep it. |
| `Web/assets/` | Logo + symbol PNGs (navy + inverse/cream variants) and site photos (`bg-hero`, `bg-modernista`, `erico-retrato`). |
| `Web/robots.txt`, `Web/sitemap.xml` | Launch-ready for erico.law (see indexing below). |

### Routing & indexing (`vercel.json`)
- **Rewrites** serve `Web/` at the domain root: `/` → `Web/index.html`, `/site.html` → `Web/site.html`, `/assets/*` → `Web/assets/*`.
- **Headers** apply `X-Robots-Tag: noindex, nofollow` **scoped by host to `ericoadv.vercel.app`**. This keeps the approval domain out of Google while leaving erico.law (a different host) indexable with zero edits.

## Deploying

```bash
git add Web/ vercel.json
git commit -m "description"
git push origin main   # Vercel auto-deploys in ~30s
```

**Only `Web/`, `vercel.json`, `CLAUDE.md`, and `README.md` are tracked** (20 files total). Everything else at the repo root is intentionally untracked and **confidential** — `proposta-erico-advogados.*` (contains pricing), `MARKET-RESEARCH.md`, `Docs/`, `PPT/`, `Brand — Erico.pdf`, `assets/` (source images). **Never `git add .`** — stage `Web/` and `vercel.json` explicitly.

## Local preview — environment caveat

This repo lives under a Dropbox **CloudStorage** path the Claude preview/dev-server runner cannot `chdir`/`getcwd` into (macOS TCC → `python3 -m http.server` crashes on `os.getcwd()`). On a normal machine `cd Web && python3 -m http.server 4321` works fine. Inside Claude:

1. Copy the deploy folder out of CloudStorage: `cp -R Web/. /tmp/erico-adv-web/`
2. Point `.claude/launch.json` at `cd /tmp/erico-adv-web && exec python3 -m http.server 4321`, then `preview_start`.
3. **Re-copy after every edit** (`cp Web/site.html /tmp/erico-adv-web/`) and reload.

Gotcha: in that headless preview, programmatic `scrollTo` doesn't fire scroll events or repaint screenshots when scrolled — verify scroll-dependent behavior by dispatching a real `scroll` event and reading the DOM, not by screenshotting a scrolled position. (Also in project memory.)

## `site.html` architecture

Section flow: sticky **nav** → **hero** (full-bleed Niemeyer photo + a left→right "concreto" scrim for text contrast) → **01 Atuação** (STF / STJ / Arbitragem pillars) → **O Modelo** (dark band) → **02 Perfil** → **03 Publicações** → **04 Contato** → footer. A mobile hamburger menu mirrors the nav.

Non-obvious things:

- **Scroll reveals are sweep-based, not `IntersectionObserver`.** `[data-reveal]` elements reveal when their top crosses ~88% of the viewport, computed directly on `scroll`/`resize`/`load`/`hashchange` (no `requestAnimationFrame`). This replaced an observer that left whole sections stuck at `opacity:0` on anchor jumps, restored scroll, and fast loads. **Do not reintroduce an observer-only reveal** — silently-hidden content is the bug it fixes.
- **The wordmark is an inline SVG `<symbol id="brand-wordmark">`**, traced from the PNG (the Figma library is unreachable — see below), used via `<use>` with `fill: currentColor` so one definition renders navy in the nav and cream in the footer.
- **Loader** counts `00→100` then lifts. The language toggle is wired via `[data-lang]`; EN shows an "em breve" toast (English isn't built yet). All motion is `prefers-reduced-motion`-aware.
- It's one large file — prefer **precise string edits / assertion-checked scripts** over rewriting it wholesale.

## Brand system

`site.html`'s `:root` is the canonical token set:

```
--concreto #F3F2EE   --surface #ECEAE4   --sombra / --fg #1A1A19
--fg-secondary #4A4843   --fg-muted #6B6860   --border #DDD9D1   --border-strong #C2BEB4
--azul #00347E   --dourado #B28C4D   --verde #386247   (+ --on-dark-* cream rgba steps)
```

- **`--azul` (#00347E) is the primary accent / action color** — active states, links, and the lead "Tribunais Superiores" headline line. **`--dourado` (#B28C4D) is decorative only** — rules, ticks, section numbers; it fails text contrast (~2.8:1), so never set body copy in it. Concreto/Sombra are the light/dark base pair.
- Type: **Syne** (display, 800/700/600/500) + **Inter** (body, 400–600). No third typeface. Sharp corners throughout (Brasília brutalist "cantos vivos") — the only rounded element is the language pill.
- Aesthetic: Brasília modernist / Niemeyer — architectural photography, generous negative space, **no legal clichés** (no gavels, scales, handshakes).
- The brand **symbol** fuses the "e" of Erico with Lúcio Costa's Plano Piloto; it is decorative — the **wordmark is the primary signature**.
- **Hard constraint:** don't invent colors or type outside these foundations.

> Older pages (`index.html`, `guideline.html`) use different token *names* for two accents — `--calor` = gold, `--ceu` = blue — but the same hex values.

## Figma

The brand library **"Erico Law — LIB"** (`fileKey Id01yu8iHw0YBmJv2QJRDM`) is **not accessible via the Figma MCP** (account permissions/seat) — don't burn retries on it. Pull foundations from committed sources instead (tokens in `site.html`, the manual in `guideline.html`, assets in `Web/assets/`). For a Figma-only asset, ask Andre to export it into `Web/assets/`.

## erico.law launch checklist

When the site moves to production, update the hardcoded absolute URLs in `site.html` — `canonical`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `url`/`image` — from `ericoadv.vercel.app` → `erico.law`. The host-scoped `noindex` lifts automatically (different host); `robots.txt` + `sitemap.xml` already target erico.law.

## Reference files (untracked, confidential)

`MARKET-RESEARCH.md`, `ERICO-QUESTIONS.md` / `-PT.md` (positioning questions), `proposta-erico-advogados.md`/`.pdf` (**pricing — keep private**), `Brand — Erico.pdf`, `Docs/`, `PPT/`, `assets/` (source images, incl. `assets/Site Images/`).
