# Nasim Mosayebi portfolio

A static portfolio built with Vite, React, TypeScript, CSS Modules and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run format
npm run build
npm run preview
```

## Edit content

All portfolio copy, projects, experience, skills and links live in one typed file:

```text
src/data/content.ts
```

Edit that file to update the site. Components should not need to change for normal content updates.

## Add screenshots and other media

Add real project media to the matching folder in `public/assets`. Screenshot paths, dimensions and alt text are listed in `src/data/screens.ts`.

```text
public/assets/pathlife/icon.png
public/assets/pathlife/01-main.png
public/assets/pathlife/02-event.png
public/assets/pathlife/03-career.png
public/assets/pathlife/04-education.png
public/assets/pathlife/05-profile.png

public/assets/pawlife/icon.png
public/assets/pawlife/01-home.png
public/assets/pawlife/02-minigame.png
public/assets/pawlife/03-minigames-list.png
public/assets/pawlife/04-event.png
public/assets/pawlife/05-achievements.png
public/assets/pawlife/06-share-card.png

public/assets/physio-ai/interface-01.png
public/assets/physio-ai/demo.mp4

public/assets/co2-tracker/01-home.png
public/assets/co2-tracker/02-search.png

public/assets/hospital/01-login.png
public/assets/hospital/02-booking.png
public/assets/hospital/03-confirmation.png
public/assets/hospital/04-schedule.png
public/assets/hospital/05-tests.png
public/assets/me/photo.jpg
```

PNG and JPEG screenshots are converted to WebP by `npm run build`. Game captures are cropped to the 393 × 852 phone ratio and capped at 1179px wide. Team-project captures are capped at 2000px wide. PNG fallbacks are kept. App icons stay as PNG.

Missing images automatically show a clean `Screenshot coming soon` frame. The Physio-AI video is optional and falls back to its screenshot.

### Re-capture PawLife

Start PawLife's web build on port 8085, then run the reusable Playwright capture:

```bash
# In the PawLife project or a throwaway copy
npm run web -- --port 8085

# In this portfolio repository
npm run capture
```

The script uses a 393 × 852 mobile viewport at 3× scale, creates Maple the Golden Retriever, follows the current player-facing flow and writes PNG plus WebP files. Set `PAWLIFE_URL` if the app is running at another local URL.

### Re-capture CO2 Tracker

Start the supplied CO2 Tracker front end on port 4180, then run:

```bash
npm run capture:team
```

The Playwright script captures the real landing and search interfaces at 1440 × 900 with a 2× device scale. Set `CO2_TRACKER_URL` if the app is running at another local URL.

Add the CV at:

```text
public/Nasim-Mosayebi-CV.pdf
```

## Fill these placeholders

- `[LANGUAGE_3]`
- `[LANGUAGE_4]`
- PathLife public code URL, if available
- PawLife public code and demo URLs, if available
- Physio-AI demo URL, if available
- Final deployed portfolio URL for canonical and Open Graph URL metadata
- PawLife minigames-list screenshot
- PawLife share-card screenshot
- Physio-AI screenshot and optional video
- CO2 Tracker result/detail and history screens, which are not included in the supplied front-end archive
- Optional profile photo
- `public/Nasim-Mosayebi-CV.pdf`

## Deploy to GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds and deploys the site on every push to `main`. In the GitHub repository settings, choose **GitHub Actions** as the Pages source.

The Vite base path is derived from `GITHUB_REPOSITORY` during the Actions build, so project pages work at `https://username.github.io/repository-name/`. Local builds continue to use `/`.

## Deploy to Netlify

Import the repository in Netlify and use:

- Build command: `npm run build`
- Publish directory: `dist`

No server or environment variables are required.
