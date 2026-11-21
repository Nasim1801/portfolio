# Nasim Mosayebi portfolio

A production portfolio for a London software engineer and mobile developer. Built with Vite, React, TypeScript, CSS Modules and restrained Framer Motion. The output is fully static and deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run format
npm run build
npm run preview
```

The production preview is served from `/portfolio/`, matching the GitHub Pages base path.

## Edit content

All portfolio copy, project details, experience, skills and links are in the typed data file:

```text
src/data/content.ts
```

Screenshot paths, dimensions and alt text are in:

```text
src/data/screens.ts
```

## Project media

Real product media lives under `public/assets/`:

```text
public/assets/sumlume/
public/assets/pathlife/
public/assets/pawlife/
public/assets/physio-ai/
public/assets/co2-tracker/
public/assets/hospital/
```

Add the full-size PNG to the relevant folder and reference it in `src/data/screens.ts`. `npm run build` generates or refreshes WebP versions for the captured portfolio media. Do not use mock screens in place of real product evidence.

The CV download is:

```text
public/Nasim-Mosayebi-CV.pdf
```

## Routes and SEO

The build creates static HTML entry points with unique metadata for:

```text
/portfolio/
/portfolio/projects/sumlume/
/portfolio/projects/pathlife/
/portfolio/projects/physio-ai/
/portfolio/projects/pawlife/
```

`scripts/generate-static-routes.mjs` creates those entry points and the GitHub Pages fallback. Update that script and `public/sitemap.xml` when adding an indexable case study.

## QA

With the production preview running on port 4173:

```bash
npx tsx scripts/qa-portfolio.ts
```

This checks all major routes at 360, 768, 1280 and 1600 pixels in light and dark mode. It also checks overflow, images, titles, heading count, console errors, mobile navigation and lightbox keyboard controls.

## Deploy

The workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`. GitHub Pages must use **GitHub Actions** as its source.

Production URL:

```text
https://nasim1801.github.io/portfolio/
```

No server or environment variables are required.
