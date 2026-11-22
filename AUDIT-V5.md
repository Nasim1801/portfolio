# Portfolio V5 audit

Audited on 22 November 2026 against the V4 build on `main` (`c713279`), served locally with `npm run build` and `npm run preview`. Evidence was gathered with Playwright and Google Chrome 153 at 1440 px and 390 px in light and dark mode (`scripts/review-capture.ts`), the existing build, lint, format and Lab tests, a fresh-page deep-link test for every home anchor, an HTTP check of every internal link, and a text extract of `public/Nasim-Mosayebi-CV.pdf`.

Before screenshots: `review/v5-before-1440-light.png`, `review/v5-before-1440-dark.png`, `review/v5-before-390-light.png`, `review/v5-before-390-dark.png`. Machine-readable findings: `review/v5-before-report.json`.

Findings are ranked by their likely effect on a recruiter or hiring manager deciding whether to interview Nasim. The **Change** line records what V5 did about each one.

## Baseline checks

| Check                              | Result                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run build`                    | Passed. Main JS 292 kB (91 kB gzip), CSS 34 kB + 11 kB.                                    |
| `npm run lint`                     | Passed, zero warnings.                                                                     |
| `npm run format`                   | Passed.                                                                                    |
| `npm run test:lab`                 | Passed.                                                                                    |
| `npm run qa`                       | Could not run as written. It defaults to a macOS Chrome path and needs `PORTFOLIO_CHROME`. |
| Horizontal overflow                | None on any of the nine routes at 390 or 1440 px.                                          |
| JavaScript errors, failed requests | None.                                                                                      |
| Cumulative layout shift            | 0 on every route measured.                                                                 |
| Automated text contrast            | No text below WCAG AA on solid backgrounds in either theme.                                |
| Headings                           | One `h1` per route and no skipped levels.                                                  |
| Internal links                     | All nine routes and the CV return HTTP 200.                                                |

## 1. Critical: deep links to sections never land (`#pathlife`, `#work`, `#contact` and every other anchor)

Opening `https://nasim1801.github.io/portfolio/#pathlife` in a fresh tab leaves the page at the top. The same is true of `#work`, `#sumlume`, `#physio-ai`, `#pawlife`, `#about`, `#skills`, `#experience`, `#contact` and `#team-work` at both widths: the measured scroll position stays at 0 after 3.5 seconds. The static HTML has an empty `#root`, so the browser looks for the fragment before React has rendered the element and never tries again. This breaks links pasted into applications or emails, the case-study breadcrumb ("Selected work" points at `/#work`) and the "View evidence" links in the skills map (`#team-work`).

**Change:** the home page now resolves the fragment after it renders and again after fonts settle, with `scroll-margin-top` on every target so the heading clears the fixed header. Verified in fresh tabs for every anchor at 1440 and 390 px.

## 2. Critical: the CV contradicts the job search

The downloadable CV's profile opens with "Computer Science graduate … applying for postgraduate study in Artificial Intelligence". The site asks for graduate or junior engineering roles. A recruiter who opens the CV from the hero reads a different goal in the first line.

**Change:** none possible from the repository, because the CV is a PDF that Nasim owns. Listed in the owner actions below. The site now labels the download plainly as "Download CV (PDF)".

## 3. High: first impression is strong on identity but weak on role and contact

- The role reads "Software Engineer & Creative Developer". "Creative Developer" is not a London job title that matches the roles named in the Contact section (Software Engineer, Mobile Developer, Full-Stack Developer).
- The intro ("building native apps, full-stack systems and interactive web experiences") lists categories rather than a value statement.
- There is no Contact call to action in the hero. Email appears only at the end of a 11,000 px page (14,000 px on mobile).
- On mobile the hero showcase pushes the proof strip and the first project below the first screen.

**Change:** the hero now says "Software engineer, mobile and full-stack", gives a one-line value statement built from verified facts, and offers View work, Download CV and Contact. London and availability sit directly under the actions. Contact is one click from the hero and the header navigation, and the contact band opens with the email address.

## 4. High: unsupported or unclear claims

Claims with no evidence in `README.md`, `REVIEW.md`, `DESIGN-V3.md`, `ASSET-AUDIT-V4.md` or the CV:

| Claim on the site                                         | Where                            | Status                                                                                                             |
| --------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| "13 screens ported to Android"                            | PathLife facts                   | Not in the repo docs or the CV. Removed from the facts list; flagged for Nasim.                                    |
| "500+ image and sound assets migrated"                    | PathLife facts, home card        | Not in the repo docs or the CV. Kept out of headline facts; flagged.                                               |
| "5 ad networks integrated"                                | PathLife facts, home card        | Not in the repo docs or the CV. Kept as a plain sentence in the case study and flagged for confirmation.           |
| "rate limiting" on the support platform                   | PathLife case study              | Not in the CV. Kept in the case study only, flagged.                                                               |
| Sumlume Android "in Kotlin"                               | Sumlume card, case study, skills | Kotlin appears nowhere in the CV. Removed from home tags and skills; left in the case study text and flagged.      |
| Sumlume is not on the CV at all                           | Whole site                       | The App Store listing is documented in `ASSET-AUDIT-V4.md`. Flagged so the CV and site agree.                      |
| "Founder & Software Developer, Aug 2026 – now"            | Experience                       | The CV has no PathLife Studio role. The brief confirms Nasim founded the studio. Date flagged for confirmation.    |
| "16 minigames"                                            | PawLife skill evidence           | The CV says "minigames"; `ASSET-AUDIT-V4.md` says the minigames list was removed from the gallery. Number removed. |
| "4 animal types"                                          | PawLife facts                    | Not in the docs or CV. Removed.                                                                                    |
| `knowsAbout: Kotlin` in JSON-LD                           | `index.html`                     | Same as the Kotlin claim. Replaced with the verified stack.                                                        |
| "Supervised by Dr David Bell" and "25-achievement system" | CV only                          | Not on the site. Not added.                                                                                        |

**Change:** facts that are in the CV or the asset audit stay. Unverified numbers were removed. Everything above is repeated in the final report so Nasim can confirm or supply evidence.

## 5. High: strongest work is not presented in hiring order, and the home page is long

- The order is Sumlume, PathLife, Physio-AI, PawLife, This Portfolio, then team projects. PathLife is the shipped product with the clearest, CV-backed ownership story (iOS contribution, Android rebuild, production support platform), but it is second.
- Five full-height project chapters each carry a complete gallery (6–7 thumbnails each), then a Lab banner, two team projects, a tabbed skills map, an about block, an eight-row timeline and contact. The home page is 11,100 px tall at 1440 px.
- "This Portfolio" sits among shipped products, which dilutes them.
- Project chapters show role only on the case-study page. The home view does not say what Nasim did.

**Change:** four featured projects, PathLife first, each with a one-line summary, her role, stack and links. The portfolio itself, CO2 Tracker and the Hospital Appointment System move to a compact "More work" list. Full galleries live on the case-study pages. The home page drops from 11,101 px to 7,640 px at 1440 px and from 14,021 px to 12,238 px at 390 px.

## 6. High: case studies are long but missing the parts a hiring manager scans for

The case studies are thorough prose but none states constraints, key decisions, outcome or what she would change, under headings that make those easy to find. Section titles are clever phrases ("Clarity is an engineering constraint.") rather than signposts.

**Change:** PathLife and Physio-AI are rewritten as structured case studies: Problem, Constraints, Architecture, Key decisions, Challenges, Outcome, What I'd improve. Other case studies keep their verified content under plain headings. The "What I'd improve" sections are drafted from documented facts and flagged for Nasim to review.

## 7. Medium: design reads as a template

- Warm cream background, a high-contrast display serif with single italic words ("Selected _work_", "Engineering _Lab_", "Nasim _Mosayebi_"), small tracked-out uppercase eyebrows above nearly every heading, and middle-dot meta strings throughout. Each is a common generated-portfolio default.
- A large-number-small-label proof strip repeats directly under the hero.
- Three typefaces (Instrument Serif, Manrope, JetBrains Mono) and many one-off sizes; spacing values are not on a shared scale.
- The interface demonstrates little of the game-studio side of Nasim's work beyond screenshots.

**Change:** a new identity. One variable family (Bricolage Grotesque) with an optical-size axis, a cool porcelain and indigo palette in both themes, a single spacing scale and type scale, no all-caps labels or decorative italics, and one signature interaction: a small playable "make 10" tile board in the hero, built on the same tested rule engine as the Lab.

## 8. Medium: mobile

- Fixed header covers in-page targets that have no scroll margin (see 1).
- Tap targets under 24 px tall: project jump links (23 px), "View evidence" (19 px), contact links (24 px), footer links (21 px).
- The skills map shows six stacked category tabs before any content on mobile.

**Change:** every standalone control (buttons, navigation, tiles, gallery controls, contact and footer links) is at least 44 px on touch layouts; the automated check finds no target under 24 px on any route. Inline text links inside sentences use the WCAG 2.5.8 inline exception. The skills section is a static grouped list.

## 9. Medium: performance and assets

- Home page transfers about 750 kB across 42 requests at 1440 px, mostly gallery thumbnails and screenshots that are below the fold.
- Physio-AI gallery thumbnails are the full 1179 px WebP files shown at 39 × 46 px.
- Team-project screenshots are 2000 px WebP files shown at about 630 px, with no smaller variant.
- `public/assets/pawlife/icon.png` is 1.6 MB and is only a fallback for a 51 kB WebP. PNG originals (about 2.6 MB) are shipped to `dist` although only the WebP versions are displayed.
- Three web fonts (about 86 kB) are preloaded, including an italic used for single words.
- Two hero screenshots are preloaded with `fetchpriority="high"` on every route that copies the home shell.

**Change:** the hero has no screenshots, so the largest paint is text. Home cards load two 540 px variants each, lazily except for the first card. Landscape screenshots gain 960 px and 160 px variants. PNG originals move out of `public/` to `media-src/` so they are no longer deployed; the 1.6 MB icon PNG is moved with them. One 77 kB variable font replaces three files. Image preloads were removed.

## 10. Medium: SEO and sharing

- Open Graph tags correctly use `property="og:…"`, `lang="en-GB"`, canonical URLs, a sitemap, `robots.txt`, a favicon and per-route static metadata are present.
- With JavaScript disabled the page body is empty, so crawlers that do not run scripts see only metadata.
- The social description leads with "Founder of PathLife Studio" rather than the role being sought.

**Change:** a `<noscript>` summary with name, role, location, email and CV link. Title and descriptions lead with "Software Engineer". New Open Graph image and favicon in the V5 identity.

## 11. Low: accessibility

The V4 site is in good shape: skip link, visible focus ring, reduced-motion handling, labelled controls, alt text on every meaningful image, native dialog for the lightbox. Issues found:

- `aria-live` on the Copy button announces the button's own label change, which is noisy.
- The skills map used `role="tablist"` but the technology buttons inside the panel were a second, unlabelled control set, which makes the structure hard to follow with a screen reader.
- Footer "Back to top" uses `href="#"`.

**Change:** a separate polite status message for the copy action, a plain list for skills, and "Back to top" now targets `#main-content`.

## 12. Low: code quality

- Lint and format were clean.
- `ArrowUpRight` in `Icons.tsx` is unused. `ExhibitionHero`, `SkillAtlas`, `ProofStrip`, `LabInvitation` and `TeamProjects` are replaced by the redesign.
- `scripts/qa-portfolio.ts` defaults to a macOS-only Chrome path.
- `content.ts` mixes copy, case-study prose and a 220-line skill evidence map in one 1,060-line object.

**Change:** removed dead components and icons, simplified the skill model, made QA fall back to Playwright's own Chromium when `PORTFOLIO_CHROME` is not set, and updated QA to the new interface.

## External links

The sandbox egress policy blocked direct requests to GitHub, LinkedIn, YouTube, the App Store and pathlifestudio.com, so these could not be checked with HTTP from here. The PathLife App Store listing (`id6769602618`, version 2.1.3, seller PathLife Studio Ltd) was confirmed through a web fetch. The Sumlume listing and the GitHub, LinkedIn, YouTube and studio links are recorded as verified in `ASSET-AUDIT-V4.md` and `REVIEW.md` and were not changed. Nasim should click through them once after deploying.

## Verification after the redesign

Run on 22 November 2026 against the `redesign-v5` build.

| Check                                                                                                     | Before (V4)             | After (V5)                                                                               |
| --------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `npm run lint`, `format`, `test:lab`                                                                      | Pass                    | Pass (tests now also prove the hero board is always solvable)                            |
| `npm run build`                                                                                           | Pass                    | Pass                                                                                     |
| `npm run qa` (90 route, width and theme combinations plus interactions)                                   | Could not run off macOS | Pass with `PORTFOLIO_CHROME=/usr/bin/google-chrome`                                      |
| Fresh-tab deep links (`#work`, `#pathlife`, `#sumlume`, `#physio-ai`, `#about`, `#skills`, `#experience`) | Never scrolled          | Land 84 px from the top, below the 68 px header                                          |
| `#contact` deep link                                                                                      | Never scrolled          | Scrolls to the end of the page (the section is the last one, so it cannot reach the top) |
| Case-study fragment, e.g. `/projects/pathlife/#outcome`                                                   | Never scrolled          | Lands 84 px from the top                                                                 |
| Home transfer at 1440 px                                                                                  | 753 kB, 42 requests     | 524 kB, 17 requests                                                                      |
| Deployed `dist` size                                                                                      | 9.6 MB                  | 5.9 MB                                                                                   |
| Web fonts                                                                                                 | 3 files, about 86 kB    | 1 file, 77 kB                                                                            |
| Layout shift, overflow, console errors, failed requests                                                   | 0                       | 0                                                                                        |
| Text below WCAG AA (automated, both themes)                                                               | 0                       | 0                                                                                        |
| Targets under 24 px at 390 px                                                                             | 14 on home              | 0 on every route                                                                         |
| Internal links and CV                                                                                     | 200                     | 200                                                                                      |

After screenshots: `review/v5-after-1440-light.png`, `review/v5-after-1440-dark.png`, `review/v5-after-390-light.png`, `review/v5-after-390-dark.png`. Report: `review/v5-after-report.json`. The before captures repeat the fixed header part-way down the page; that is an artefact of Playwright's full-page capture, which the after captures avoid by pinning the header for the screenshot.

## Owner actions

1. **Replace the CV profile.** The PDF says Nasim is applying for postgraduate study in AI. Upload a job-focused version to `public/Nasim-Mosayebi-CV.pdf` (same file name, so links keep working). Consider adding Sumlume and the PathLife Studio founder role so the CV and site agree.
2. **Confirm or supply evidence for the flagged claims** in section 4: Android screen count, asset count, number of ad networks, Sumlume Android in Kotlin, the August 2026 start date for PathLife Studio, and the support site's rate limiting.
3. **Review the drafted sections.** "Key decisions" for PathLife and "What I'd improve" for PathLife and Physio-AI were written from documented facts but phrase Nasim's own judgement. Edit them in `src/data/content.ts` (`draftedSections` marks them).
4. **Click every external link once after deploying** (App Store, GitHub repos, LinkedIn, YouTube demo, pathlifestudio.com). The sandbox could not reach them.
5. **Optional evidence that would strengthen the site:** a public Google Play link when an Android build ships, any real usage figures you are happy to publish (downloads, ratings, retention), a short screen recording of PathLife or Sumlume, PawLife screenshots of the minigames, and a sanitised code sample from a mobile project.
6. **Merge and deploy.** Merge `redesign-v5` into `main` and push; the existing GitHub Actions workflow deploys it.
