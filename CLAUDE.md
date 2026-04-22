# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A pre-design market research brief for **Erico Advogados**, a boutique arbitration law firm in Brasília. The deliverable is a single-page HTML document used to share findings with the client before any website design begins.

**Live URL:** https://ericoadv.vercel.app
**GitHub:** https://github.com/finaga/ericoadv

## Stack

Plain HTML + embedded CSS. No build step, no framework, no dependencies. `index.html` is the entire project. Open it directly in a browser or push to GitHub — Vercel deploys automatically on every push to `main`.

## Deploying

```bash
git add index.html
git commit -m "description"
git push origin main   # triggers Vercel auto-deploy in ~30 seconds
```

Manual deploy if needed:
```bash
vercel deploy --yes --name ericoadv
```

## Project context

- **Client:** Erico Carvalho, founder of Erico Advogados
- **Designer:** Andre Finageiv
- **Language:** Brazilian Portuguese (`lang="pt-BR"`)
- **Phase:** Pre-design research — no website exists yet beyond the research brief

## Design system (in `index.html`)

All styles are embedded in `<style>` in the `<head>`. The CSS custom properties define the palette:

```css
--white: #F6F4EF   /* warm off-white, primary background */
--black: #111110   /* near-black, dark section backgrounds */
--ink:   #1E1D1B   /* body text */
--mid:   #6B6860   /* secondary text — use #4A4843 for better contrast */
--light: #D8D4CB   /* borders, dividers */
--gold:  #B8965A   /* accent — section labels, callouts */
--sky:   #3D6B8C   /* used for competitor strengths */
--surface: #ECEAE4 /* alternate section background */
```

**Typography rules:**
- Headlines/display: `Cormorant Garamond` — weight 300 only above ~50px; weight 400 for anything at reading size (22px and below); weight 600 for emphasis
- Body: `Inter` — weight 400/500/600
- Never use Cormorant Garamond at weight 300 below 40px — it becomes illegible
- Body text on dark backgrounds: minimum `rgba(255,255,255,0.72)` opacity for contrast compliance

**Aesthetic direction:** Brasília modernist / Oscar Niemeyer — geometric shapes, white surfaces, curves against straight lines, generous negative space.

## Reference files (not deployed)

- `MARKET-RESEARCH.md` — the full research in markdown (source for `index.html`)
- `ERICO-QUESTIONS.md` — 13 positioning questions in English
- `ERICO-QUESTIONS-PT.md` — same questions in Brazilian Portuguese (for the Google Form)
