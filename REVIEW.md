# Portfolio V3 review

This document records the earlier V3 review. The owner requested a substantial redesign after reviewing the deployed version.

Reviewed on 21 November 2026 as both a London technical recruiter screening graduate and junior engineers and a hiring manager inspecting implementation evidence.

## Before

V2 was clear, technically sound and rich in real media, but its interface used a familiar two-column hero, repeated rounded cards and passive skill pills. The visual design described front-end ability without demonstrating enough of it. A recruiter could understand the candidate, but the site did not create a memorable reason to stay. A hiring manager had useful case studies but no working browser interaction to inspect.

At 390px, name, location and proof were present, but the first screen was visually dense and the CV route was not prominent enough. At 1440px, the layout was polished yet conventional.

Before screenshots:

- `review/v3-before-390.png`
- `review/v3-before-1440.png`

### Before scorecard

| Area                              | Score | Reasoning                                                                                                |
| --------------------------------- | ----: | -------------------------------------------------------------------------------------------------------- |
| First impression and clarity      |  8/10 | The facts were strong, but the presentation did not immediately differentiate the candidate.             |
| Visual design and consistency     |  7/10 | Consistent and usable, but too close to a standard product landing page.                                 |
| Project presentation and evidence |  8/10 | Real screenshots and dedicated case studies were strong. The home presentation repeated one card system. |
| Technical credibility             |  8/10 | The copy explained engineering decisions, but the website itself offered little inspectable interaction. |
| Writing quality and tone          |  9/10 | Specific, honest and concise.                                                                            |
| Contact and calls to action       |  8/10 | Working contact routes existed, but mobile CV access needed to be faster.                                |
| Mobile experience                 |  8/10 | Responsive and usable, with a less distinctive first screen than desktop.                                |
| Accessibility                     | 10/10 | The previous audited release achieved Lighthouse 100.                                                    |
| Performance                       |  8/10 | Media was optimised, but the homepage Lighthouse score was 88.                                           |
| SEO and link sharing              | 10/10 | Static case routes, metadata, sitemap and structured data were already present.                          |

## Creative direction

Two directions were compared before implementation:

1. **Signal Field:** a spatial editorial system connecting real products, technologies and verified evidence.
2. **Engineering Workbench:** a denser console-inspired experience with project panels and system views.

Signal Field was selected because it provides stronger originality without slowing the recruitment path or losing its concept on mobile. The full comparison and rationale are documented in `DESIGN-V3.md`.

## What changed

### Signature experience

- Replaced the static hero composition with an interactive project constellation.
- Added pointer-responsive light, touch selection and arrow-key navigation.
- Kept identity, target role, London, proof, CV and work links independent of the interaction.
- Replaced the square monogram treatment with a custom typographic N/M wordmark and numbered navigation.

### Engineering Lab

- Added `/portfolio/lab/` as a real static route.
- Added a playable make-10 demonstration based on Sumlume’s verified equal-number and total-of-10 rule.
- Separated puzzle validation into pure TypeScript functions with an automated test.
- Added an interactive Physio-AI pipeline visualisation with five explorable stages, a squat-depth control and a knee angle derived from pose geometry.
- Labelled the Physio-AI exhibit as a visual simulation. It does not claim live inference.

### Project exhibition

- Replaced repeated cards with full-width, asymmetric project chapters.
- Kept authentic screenshots in phone, browser and desktop frames.
- Retained keyboard-accessible galleries and lightboxes.
- Prioritised Sumlume, PathLife, Physio-AI and PawLife, then documented this portfolio as a fifth major project.
- Preserved meaningful full-stack visibility for CO2 Tracker and Java/JUnit evidence for the Hospital Appointment System.

### Technical evidence map

- Replaced passive skill pills with six selectable engineering categories.
- Every technology opens real implementation evidence and a route to the relevant project.
- No proficiency percentages or unsupported technologies were added.

### Portfolio case study

- Added `/portfolio/projects/portfolio/`.
- Documented design objectives, component architecture, responsive decisions, motion, accessibility, performance, SEO, deployment, trade-offs and maintenance.
- Linked to the public source repository.

## After

At 1440px, the first screen now behaves like a technical artefact rather than a landing-page template. It communicates Nasim Mosayebi, Software Engineer / Creative Developer, London, two live App Store products and the 96.23% Physio-AI result before interaction is required.

At 390px, the same information remains readable, the CV is available in the fixed header, the project field becomes a touch-friendly selector, galleries become swipeable and the lab remains playable.

After screenshots:

- `review/v3-after-390.png`
- `review/v3-after-1440.png`

### After scorecard

| Area                              | Score | Reasoning                                                                                        |
| --------------------------------- | ----: | ------------------------------------------------------------------------------------------------ |
| First impression and clarity      |  9/10 | Identity, role, London and strongest evidence are visible immediately.                           |
| Visual design and consistency     | 10/10 | The signal-field language is distinctive, coherent and substantially different from V2.          |
| Project presentation and evidence | 10/10 | Five major chapters combine authentic media, outcomes, technology and technical routes.          |
| Technical credibility             | 10/10 | The site now contains working state, validation, geometry, SVG, Canvas and keyboard interaction. |
| Writing quality and tone          |  9/10 | Verified facts remain concise and in British English.                                            |
| Contact and calls to action       | 10/10 | CV, email, LinkedIn and GitHub are available at clear decision points.                           |
| Mobile experience                 |  9/10 | The concept adapts at 360px without horizontal overflow or loss of functionality.                |
| Accessibility                     | 10/10 | Both representative routes score Lighthouse 100 and the custom controls are keyboard accessible. |
| Performance                       |  9/10 | Homepage is 91 and the interactive Lab is 98 on the Lighthouse mobile profile.                   |
| SEO and link sharing              | 10/10 | The new routes have static metadata, canonical URLs, structured data and sitemap entries.        |

## Measured verification

### Lighthouse mobile

| Route           | Performance | Accessibility | Best Practices | SEO |   LCP |  TBT | CLS |
| --------------- | ----------: | ------------: | -------------: | --: | ----: | ---: | --: |
| Home            |          91 |           100 |            100 | 100 | 3.4 s | 0 ms |   0 |
| Engineering Lab |          98 |           100 |            100 | 100 | 2.3 s | 0 ms |   0 |

### Automated checks

- TypeScript production build: passed.
- ESLint with zero warnings: passed.
- Prettier check: passed.
- Engineering Lab rule tests: passed.
- Browser QA: 70 route, viewport and theme combinations at 360, 390, 768, 1440 and 1920 pixels.
- Browser overflow, missing images, alt text, heading count, insecure blank links, console errors and failed requests: none.
- Mobile menu, constellation keyboard navigation, skill selection, lightbox, puzzle validation, pipeline tabs and pose range: verified.

### Production release verification

- V3 release commit: `1bb0966` (`Build interactive creative portfolio V3`).
- GitHub Actions run: `44951132835`, build and deploy jobs passed.
- Live homepage: `https://nasim1801.github.io/portfolio/`.
- Live Engineering Lab: `https://nasim1801.github.io/portfolio/lab/`.
- Live portfolio case study: `https://nasim1801.github.io/portfolio/projects/portfolio/`.
- Production browser check: project constellation selection, make-10 validation, pose-depth range and pipeline stage selection passed with no browser console errors or warnings.

## Recruitment assessment

The site now gives a recruiter a fast, unambiguous job-search story while giving a hiring manager something real to inspect. The interaction system supports the claim of front-end capability, the real screenshots support product ownership, and Physio-AI plus CO2 Tracker prevent the portfolio from reading as mobile-games-only.

PathLife Studio is positioned as evidence of ownership and delivery while the page explicitly states the search for a graduate or junior role in London. It makes no unsupported statement about hours, visa status or availability dates.

## Remaining limitations and owner actions

1. LinkedIn blocks automated link validation. Check it manually in a signed-in browser after release.
2. Search Console access is not available, so the sitemap cannot be submitted or indexing inspected from this repository.
3. PawLife still has no minigames-list or share-card capture. The case study deliberately shows only the real screenshots currently available.
4. Private game source code remains private. A sanitised mobile code sample could add hiring-manager evidence later without exposing commercial repositories.
