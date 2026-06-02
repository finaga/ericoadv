# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A brand & strategy microsite for **Erico Advogados**, a boutique litigation firm in Brasília whose core practice is strategic litigation before the higher courts (STF/STJ), with arbitration as a complementary layer. It began as a single-page pre-design research brief and has grown into a small multi-page site with a full brand redesign.

**Live URL:** https://ericoadv.vercel.app
**GitHub:** https://github.com/finaga/ericoadv

## Stack

Plain HTML + embedded CSS. No build step, no framework, no dependencies. All deployed pages live in the `Web/` folder. Open them directly in a browser or push to GitHub — Vercel deploys automatically on every push to `main`.

### Pages (all in `Web/`)

| File | `<title>` | Role |
|------|-----------|------|
| `Web/index.html` | erico — Marca & Estratégia | Landing / hub |
| `Web/estrategia.html` | erico — Estratégia de Marca | The pre-design research & strategy brief (was the original root `index.html`) |
| `Web/guideline.html` | Erico Advogados — Manual da Marca | Brand manual / guidelines |

`Web/assets/` holds the brand logos (wordmark + symbol variants, including inverse versions).

### Routing

`vercel.json` rewrites the root so the `Web/` folder is served at the domain root:

```json
{ "rewrites": [
    { "source": "/", "destination": "/Web/index.html" },
    { "source": "/:path*", "destination": "/Web/:path*" }
] }
```

So `ericoadv.vercel.app/` serves `Web/index.html`, `/estrategia.html` serves `Web/estrategia.html`, etc.

## Deploying

```bash
git add Web/ vercel.json
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
- **Phase:** Brand redesign — multi-page microsite live; positioning confirmed from Erico's direct answers ("brief corrigido")

## Design system (embedded per page)

All styles are embedded in `<style>` in each page's `<head>`. The current brand palette (named tokens, post-redesign):

```css
--white: #F3F2EE   /* Concreto — primary background */
--black: #1A1A19   /* Sombra — dark sections */
--ink:   #1A1A19   /* Sombra — body text */
--mid:   #6B6860   /* fg-muted — secondary text */
--light: #DDD9D1   /* border — borders, dividers */
--gold:  #B28C4D   /* Calor — accent */
--sky:   #00347E   /* Céu — competitor strengths / accent */
--surface: #ECEAE4 /* surface — alternate section background */
```

> Note: the *original* research brief used a warmer palette and `Cormorant Garamond`. The redesign replaced that with the named-token palette above and `Syne`.

**Typography rules:**
- Headlines/display: `Syne` — weights 400–800
- Body: `Inter` — weight 400/500/600
- Body text on dark backgrounds: minimum `rgba(255,255,255,0.72)` opacity for contrast compliance

**Aesthetic direction:** Brasília modernist / Oscar Niemeyer — geometric shapes, white surfaces, curves against straight lines, generous negative space.

## Reference files (not deployed)

- `MARKET-RESEARCH.md` — the full research in markdown (source for `Web/estrategia.html`)
- `ERICO-QUESTIONS.md` — 13 positioning questions in English
- `ERICO-QUESTIONS-PT.md` — same questions in Brazilian Portuguese (for the Google Form)
