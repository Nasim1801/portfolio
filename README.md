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
# In a second terminal
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

Real media is stored under `public/assets/`. Run `npm run prepare:assets -- --game pathlife dashboard /absolute/path/to/capture.png` to import a verified game image. Update its dimensions, label and alt text in `src/data/screens.ts` and its provenance in `ASSET-AUDIT-V4.md`. For non-game media the build generates display WebP files from the checked-in PNG originals.

The downloadable CV is `public/Nasim-Mosayebi-CV.pdf`.

## Main architecture

- `src/components/ExhibitionHero.tsx`: keyboard-operable selector and layered product artwork.
- `src/components/Media.tsx`: responsive gallery, swipe controls, and full-resolution dialog.
- `src/components/lab/`: the playable make-10 board and interactive Physio-AI system visualisation.
- `src/lab/sumlumeEngine.ts`: pure, independently tested matching rules.
- `src/components/SkillAtlas.tsx`: selectable technology-to-project evidence map.
- `src/components/CaseStudyPage.tsx`: shared technical case-study structure.
- `src/styles/site.module.css`: core responsive visual system.
- `src/styles/lab.module.css`: Engineering Lab interface and exhibit states.

See `ASSET-AUDIT-V4.md` for release and development media sources. `DESIGN-V3.md` records the previous design.

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
/portfolio/projects/co2-tracker/
/portfolio/projects/hospital-appointment-system/
```

`scripts/generate-static-routes.mjs` generates route-specific titles, descriptions, canonical URLs, social metadata and structured data, plus the GitHub Pages fallback. Update that script and `public/sitemap.xml` when adding a route.

## Interaction and browser QA

`npm run test:lab` validates the Sumlume demonstration rules without the UI. `npm run qa` checks all nine routes at 360, 390, 768, 1440 and 1920 pixels in light and dark mode. It also verifies images, alt text, overflow, headings, failed requests, JavaScript errors, the mobile menu, product-selector keyboard controls, skill selection, CV download, theme persistence, screenshot controls and both Lab interactions. Set `PORTFOLIO_AXE_PATH` to a local copy of axe-core to run accessibility scans at 390 and 1440 pixels. Set `PORTFOLIO_CHROME` to use another Chrome executable.

## Deploy

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. GitHub Pages must use **GitHub Actions** as its source.

Production URL: [nasim1801.github.io/portfolio](https://nasim1801.github.io/portfolio/)

No server or environment variables are required.
