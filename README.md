# Nasim Mosayebi portfolio

A creative engineering portfolio for a London software engineer. Built with React, TypeScript, Vite, CSS Modules, SVG and Canvas. The output is fully static and deploys to GitHub Pages under `/portfolio/`.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run format
npm run test:lab
npm run build
npm run preview
npm run qa
```

The production preview is served at `http://127.0.0.1:4173/portfolio/`. Keep it running before `npm run qa`.

## Edit content

Verified portfolio copy, project facts, experience, links and the skill-to-project evidence map live in the typed data file:

```text
src/data/content.ts
```

Screenshot paths, dimensions and alt text live in:

```text
src/data/screens.ts
```

Real media is stored under `public/assets/`. Add a full-size PNG to the relevant project folder and reference it in `src/data/screens.ts`. `npm run build` refreshes the optimised WebP versions. Never substitute mock screens for product evidence.

The downloadable CV is `public/Nasim-Mosayebi-CV.pdf`.

## Main architecture

- `src/components/ProjectConstellation.tsx`: pointer, touch and keyboard project field in the hero.
- `src/components/lab/`: the playable make-10 board and interactive Physio-AI system visualisation.
- `src/lab/sumlumeEngine.ts`: pure, independently tested matching rules.
- `src/components/SkillAtlas.tsx`: selectable technology-to-project evidence map.
- `src/components/CaseStudyPage.tsx`: shared technical case-study structure.
- `src/styles/site.module.css`: core responsive visual system.
- `src/styles/lab.module.css`: Engineering Lab interface and exhibit states.

The design audit, two explored directions and final rationale are in `DESIGN-V3.md`.

## Routes and SEO

The static build creates indexable HTML entry points for:

```text
/portfolio/
/portfolio/lab/
/portfolio/projects/sumlume/
/portfolio/projects/pathlife/
/portfolio/projects/physio-ai/
/portfolio/projects/pawlife/
/portfolio/projects/portfolio/
```

`scripts/generate-static-routes.mjs` generates route-specific titles, descriptions, canonical URLs, social metadata and structured data, plus the GitHub Pages fallback. Update that script and `public/sitemap.xml` when adding a route.

## Interaction and browser QA

`npm run test:lab` validates the Sumlume demonstration rules without the UI. `npm run qa` checks all seven routes at 360, 390, 768, 1440 and 1920 pixels in light and dark mode. It also verifies images, alt text, overflow, headings, secure external links, console errors, the mobile menu, constellation keyboard controls, skill selection, lightbox controls, puzzle validation and Physio-AI controls.

## Deploy

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. GitHub Pages must use **GitHub Actions** as its source.

Production URL: [nasim1801.github.io/portfolio](https://nasim1801.github.io/portfolio/)

No server or environment variables are required.
