# Nasim Mosayebi portfolio

A React and TypeScript portfolio for a London software engineering graduate specialising in iOS and mobile. Vite builds static HTML and assets for GitHub Pages under `/portfolio/`. See the [V4 design and engineering report](PORTFOLIO_V4_DESIGN_ENGINEERING_REPORT.md) for the visual comparison, measurements and evidence boundaries.

## Develop and verify

```bash
npm ci
npm run dev
```

```bash
npm run lint
npm run typecheck
npm run test:lab
npm run build
npx playwright install chromium
npm run preview
# In a second terminal
npm run qa
npm run capture:design
```

The production preview is at `http://127.0.0.1:4173/portfolio/`. Set `PORTFOLIO_CHROME` to use an existing Chrome executable or `PORTFOLIO_QA_URL` to test a different base URL. `capture:design` writes 1440 and 390 px viewport images for every route and two full-home images. `REVIEW_PREFIX`, `REVIEW_OUTPUT`, `REVIEW_THEME` and `REVIEW_ROUTES` control its output. The earlier `npm run review` also captures page-level contrast and resource diagnostics.

## Content and media

- Edit project facts, links, role descriptions and the skill evidence map in `src/data/content.ts`. Case studies carry attribution and verification boundaries next to the evidence.
- Edit screenshot paths, dimensions and alternative text in `src/data/screens.ts`. The project keeps real app captures and the production artwork used on the App Store. Record new provenance in `ASSET-AUDIT-V4.md`.
- Run `npm run prepare:assets -- --game pathlife dashboard /absolute/path/to/capture.png` to import an authorised phone capture. Landscape PNG originals live in `media-src/`. The build generates WebP display and thumbnail variants in `public/assets/`.
- The CV source is `Nasim-Mosayebi-CV.docx` and downloads serve `public/Nasim-Mosayebi-CV.pdf`.

## Architecture and Pages

- `src/routes.tsx` resolves the homepage, seven case studies, the Engineering Lab and the not-found page. Native links handle URL history and fragments.
- `src/entry-static.tsx` and `scripts/generate-static-routes.mjs` render those React pages with Vite and React DOM Server during the build. The same route modules hydrate in the browser to activate controls. Project text, source links, original-image links, navigation and CV downloads are present in the built HTML.
- Each indexable route has a title, description, canonical URL, 1200 × 630 PNG social card and JSON-LD. The route data generates the sitemap. GitHub Pages receives the pre-rendered `404.html` and static directory from the same build.
- `src/styles/global.css` defines the theme and typography tokens. CSS Modules scope the site and Lab layout. `Media.tsx` implements responsive images and the keyboard-accessible gallery. `src/lab/sumlumeEngine.ts` holds the tested TypeScript game rules.

## Release checks

The Pages workflow runs lint, strict type checking, puzzle tests, a production build and Chromium checks. The browser matrix covers all nine routes at 320, 360, 390, 768, 1024, 1440 and 1920 px in light and dark mode. It checks axe at 390 and 1440 px, fragment and route navigation, no-JavaScript pages, metadata, all three CV downloads and interactive controls. Deployment runs after the build and browser checks pass on `main`. Third-party destinations are checked separately.

Production is hosted on GitHub Pages. [Live portfolio](https://nasim1801.github.io/portfolio/)
