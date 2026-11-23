# Nasim Mosayebi portfolio

Portfolio of Nasim Mosayebi, a London-based Computer Science graduate specialising in iOS and mobile development. Built with React, TypeScript, Vite and CSS Modules. The output is fully static and deploys to GitHub Pages under `/portfolio/`.

V5 is documented in `AUDIT-V5.md` (findings and fixes) and `CHANGELOG-V5.md`. V6, the game-world redesign, is summarised in `CHANGELOG-V6.md`, the V7 hero change in `CHANGELOG-V7.md` the V8 themed objects in `CHANGELOG-V8.md` and the V9 calmer object layer in `CHANGELOG-V9.md`.

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
REVIEW_PREFIX=v5-after npm run review
```

`npm run qa` uses Playwright's Chromium (`npx playwright install chromium`) or the browser in `PORTFOLIO_CHROME`. `npm run review:moments` captures the site mid-interaction as `review/v6-moment-*.png` and records `review/v6-scroll.webm` (needs `npx playwright install ffmpeg`). `npm run review` writes full-page screenshots at 1440 and 390 px in both themes, plus a JSON report of links, contrast, tap targets, headings and transfer size, to `review/`.

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

Display media is stored under `public/assets/`. Run `npm run prepare:assets -- --game pathlife dashboard /absolute/path/to/capture.png` to import a verified game image. Update its dimensions, label and alt text in `src/data/screens.ts` and its provenance in `ASSET-AUDIT-V4.md`.

PNG originals for landscape screenshots live in `media-src/` and are not deployed. The build writes full-size, 960 px and 160 px WebP variants of each into `public/assets/`, skipping files that are already up to date.

Edit the CV in `Nasim-Mosayebi-CV.docx` and export it to `public/Nasim-Mosayebi-CV.pdf`, retaining the existing filename for download links.

## Main architecture

- `src/components/Hero.tsx`: identity, animated name, achievement badges and calls to action.
- `src/components/LevelSelect.tsx`: the hero "Choose a level" stage that rotates through the four featured projects (tab list, swipe, tilt, pause).
- `src/components/MakeTenBoard.tsx`: the playable make-10 demo shown inside the Sumlume project (roving focus, live status, win screen).
- `src/fx/`: hand-written motion. `effects.ts` (scroll reveals with a safety net, project colour worlds, tile bursts, Konami code, view-transition helper), `router.ts` (in-place navigation so pages can morph), `AmbientTiles.tsx` (a capped, evenly spaced layer of background objects that keep to their own slots, avoid text and controls, pause off screen and swap sets with the hero level), `glyphs.ts` (the per-project object sets, drawn as vector shapes and cached as sprites), `useTilt.ts` (3D tilt) and `ScrollMap.tsx` (XP bar and level map).
- `src/lab/sumlumeEngine.ts`: pure puzzle rules shared by the hero board and the Lab, tested by `scripts/test-lab.ts`.
- `src/components/Sections.tsx`: featured projects, more work, skills, about, experience, contact and footer.
- `src/components/CaseStudyPage.tsx`: case-study layout (at-a-glance facts, gallery, section navigation).
- `src/components/Media.tsx`: responsive images, device frames, swipeable gallery and full-size dialog.
- `src/components/lab/`: the Engineering Lab exhibits.
- `src/utils/links.ts`: base-path helpers and `scrollToHash`, which makes `#fragment` links land after React renders.
- `src/styles/global.css`: design tokens (colour, spacing and type scales) for both themes.
- `src/styles/site.module.css`: site components. `src/styles/lab.module.css`: the Lab.

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

`npm run test:lab` validates the portfolio puzzle rules without the UI. `npm run qa` checks all nine routes at 360, 390, 768, 1440 and 1920 pixels in light and dark mode. It checks images, layout, keyboard paths, same-origin links and fragments, all three CV downloads, the evidence jump links, gallery controls and both Lab interactions. The pinned axe-core package runs at 390 and 1440 pixels. Set `PORTFOLIO_CHROME` to use another Chrome executable.

## Deploy

`.github/workflows/deploy.yml` runs lint, Lab rule tests, the TypeScript build and browser QA on pull requests targeting `main` and on pushes to `main`. Pages upload and deployment require a passing build on `main`. GitHub Pages uses **GitHub Actions** as its source. Third-party destinations are checked separately from the same-origin link gate.

Production URL: [nasim1801.github.io/portfolio](https://nasim1801.github.io/portfolio/)

No server or environment variables are required.
