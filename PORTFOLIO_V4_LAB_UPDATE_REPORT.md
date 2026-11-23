# Portfolio V4 artwork and Engineering Lab update

The published V4 baseline is `32f9166`. This update stays on `codex/portfolio-v4`. The professional CV and Phase 2 reports, puzzle engine, rule tests and Physio-AI reproduction notes match the published baseline byte for byte.

## Project artwork

PathLife and Sumlume used tall artwork in a shallow, fixed-ratio frame. Absolute positioning, rotation and overflow clipping hid most of the game screens. Both cards now place their original portrait artwork in a responsive grid, with the primary image larger on desktop. The supporting cards fit their full landscape images. PawLife shows a native development screenshot alongside its app icon. Every artwork link opens the corresponding case-study gallery. The full-size viewer now supports zoom and keyboard panning for portrait artwork as well as landscape images.

The before captures are from the published site. The after captures are from the updated local production build, measured at the same viewport widths.

| Project  | Desktop · 1440 px                                                                                   | Mobile · 390 px                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| PathLife | [Before](review/v4-lab/before-pathlife-1440.webp) · [After](review/v4-lab/after-pathlife-1440.webp) | [Before](review/v4-lab/before-pathlife-390.webp) · [After](review/v4-lab/after-pathlife-390.webp) |
| Sumlume  | [Before](review/v4-lab/before-sumlume-1440.webp) · [After](review/v4-lab/after-sumlume-1440.webp)   | [Before](review/v4-lab/before-sumlume-390.webp) · [After](review/v4-lab/after-sumlume-390.webp)   |
| PawLife  | [Before](review/v4-lab/before-pawlife-1440.webp) · [After](review/v4-lab/after-pawlife-1440.webp)   | [Before](review/v4-lab/before-pawlife-390.webp) · [After](review/v4-lab/after-pawlife-390.webp)   |

## Engineering Lab

The [desktop](review/v4-lab/lab-index-1440.webp) and [mobile](review/v4-lab/lab-index-390.webp) indexes link directly to each demo. Visitors can switch between examples without losing the state of a demo during the page visit. Each example has a reset and a case-study link.

| Demo      | What you can try                                                                                                                                                                                             | Captures                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| PathLife  | Take a training course or a paid apprenticeship, handle a rent rise and decide whether to apply for a role. Training changes the outcome of the later application.                                           | [Desktop](review/v4-lab/lab-pathlife-1440.webp) · [Mobile](review/v4-lab/lab-pathlife-390.webp)   |
| Sumlume   | Match adjacent equal numbers or pairs that make 10, then reset the board. The screenshots show a cleared 4 and 6.                                                                                            | [Desktop](review/v4-lab/lab-sumlume-1440.webp) · [Mobile](review/v4-lab/lab-sumlume-390.webp)     |
| PawLife   | Feed or play with Bella, choose a park visit or rest, then help her through a storm. Her energy changes the outing and her bond changes how she settles.                                                     | [Desktop](review/v4-lab/lab-pawlife-1440.webp) · [Mobile](review/v4-lab/lab-pawlife-390.webp)     |
| Physio-AI | Switch pipeline stages, change squat depth and reset the view. The reported 96.23% frame accuracy and its evaluation caveats remain visible. All five stages now fit on mobile without horizontal scrolling. | [Desktop](review/v4-lab/lab-physio-ai-1440.webp) · [Mobile](review/v4-lab/lab-physio-ai-390.webp) |

The new games are portfolio-authored React and TypeScript samples. The documented mechanics are annual choices and carried-forward consequences in PathLife, and care, personality and relationships in PawLife. The demo events, stat changes and progression use simplified rules. Screenshots in the engineering notes are labelled with their native or App Store origin. The native game repositories were outside the implementation. [PathLife Studio’s PathLife page](https://www.pathlifestudio.com/pathlife.html) · [PathLife Studio’s PawLife page](https://www.pathlifestudio.com/pawlife.html)

The two demos share a presentation component. Pure reducers make transitions deterministic, handle resets and prevent actions from applying outside their intended stage. Native buttons, a live result message and focus on the new prompt make decisions usable from the keyboard. The Lab is still loaded as a route-specific chunk and uses the project’s existing dependencies.

## Verification

- Formatting, ESLint, strict TypeScript, the existing Sumlume rules, the two new simulation rule suites and the production build passed.
- Chromium passed 126 route, viewport and theme combinations across nine routes and seven widths from 320 to 1920 px. The suite checked all seven cards for preserved image proportions and containment, 185 internal links and fragments, and 36 axe scans with zero violations. Browser checks played both new demos through to completion, exercised keyboard and touch controls, and verified resets, gallery zoom and focus return. The production CV download checks also passed.
- Firefox 159 and Playwright WebKit 27.2 each passed 18 route and width smoke checks, including the Physio-AI gallery at 390 px.
- Lighthouse 12.8.2 produced the following single-run measurements on the local production preview. Mobile used simulated 150 ms RTT and 4× CPU slowdown. Each run scored 100 for accessibility, best practices and SEO, with zero cumulative layout shift and zero total blocking time.

| Page            | Mobile performance and LCP | Desktop performance and LCP |
| --------------- | -------------------------- | --------------------------- |
| Homepage        | 94 · 2.94 s                | 100 · 0.61 s                |
| Engineering Lab | 97 · 2.34 s                | 100 · 0.53 s                |

The Lab’s JavaScript and CSS chunks are 8.41 kB and 3.89 kB gzipped, respectively. The homepage’s local mobile LCP remains above the 2.5 s target. These results are lab measurements.
