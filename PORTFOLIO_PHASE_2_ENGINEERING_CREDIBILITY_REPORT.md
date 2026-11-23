# Portfolio Phase 2 Engineering Credibility Report

**23 November 2026** · Portfolio review branch based on Phase 1 production commit `b8e79b3e660259a07f759949667a01b78120de67`

The original recruitment audit identified a gap between the shipped products and the evidence a hiring manager could inspect. Phase 2 adds a direct **Engineering evidence** link to four case studies. Each one describes the problem, responsibility, decision, implementation, verification and limits. The new material distinguishes released products, local implementation checks, public source and academic results. The design system, gallery artwork, CV and homepage layout carry forward from Phase 1. [Phase 1 production release](https://github.com/Nasim1801/portfolio/actions/runs/45091253207)

## PathLife

I inspected the local SwiftUI 2.2 development snapshot. The dashboard passes the updated character to an observable session when saving. The persistence layer encodes the character with Foundation, replaces a single local record and decodes that record on load. A snapshot makes the resume path straightforward. Schema changes or a decode failure can prevent the saved life from loading, so a migration check needs real older-save fixtures.

A separate Swift executable compiled the existing save layer against a small synthetic Codable stand-in. Empty-slot reads, save and load, replacement, and deletion passed in one process. This tests the storage seam and leaves the full character schema, restart and migration unverified. For a release check, start a fresh test life, advance a year, finish any pending choice and record the resulting state. Relaunch and use Continue to compare the restored character and state. The case presents this as a procedure with an expected result.

The candidate’s documented contribution covers SwiftUI screens, game logic, the App Store support site and the Android rebuild. The storage walkthrough is attributed to the team implementation. Available history does not establish who wrote the save module or prove that the inspected development snapshot matches the App Store binary. [Public iOS listing](https://apps.apple.com/gb/app/pathlife/id6769602618)

## Sumlume

The public evidence supports the App Store release and the portfolio’s make-10 playground. The publicly available native Swift implementation and native test records were unavailable. The studio product page opened during the review, and the local browser demo script examined during discovery was absent from the live studio URL. The case therefore uses the public portfolio playground for code evidence.

Before the Phase 2 fix, asking the playground to match indexes 20 and 21 on a 20-cell board returned true. Both lookups were undefined and fell through to the equality branch. The rule now requires a numeric value in both cells before evaluating adjacency and matching. The regression suite covers missing, negative, fractional and already-cleared indexes alongside valid equal and make-10 pairs. Browser verification clears 4 and 6, resets the board and checks both tiles return. These are portfolio behaviours. Native Undo, recovery and daily challenge persistence remain unverified. [Public iOS listing](https://apps.apple.com/gb/app/sumlume-number-match/id6799957684) · [Engineering Lab](https://nasim1801.github.io/portfolio/lab/)

## Physio-AI evaluation

The dissertation credits Random Forest with **96.23% frame accuracy** and reports macro precision 0.96, recall 0.95 and F1 0.96 on 7,153 test rows. It describes a temporal 80/20 split. The project used self-recorded squat footage from one participant. The original report’s four class supports are 2,615 correct, 1,138 too deep, 1,317 forward lean and 2,083 shallow.

Two archived copies of the augmented feature CSV matched. The file had 24,492 labelled rows, 24 numeric features per row, and SHA-256 prefix `55f282124113e54f`. The archived alternate `data.csv` contained 9,323 rows and is the input for a separate exploratory script. The public retraining script uses the 24,492-row augmented CSV, adds synthetic and perturbed rows, and then performs a seeded, stratified random row split. It generated 35,764 rows, with 28,611 in train and 7,153 in test. All four test supports matched the dissertation. The last perturbation uses unseeded noise, and a historical prediction file, fitted artifact or immutable run record tying the reported score to an exact execution was unavailable. The dissertation’s temporal wording is inconsistent with this matching retraining path. [Public retraining script](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/retrain_with_augmentation.py) · [Exploratory training script](https://github.com/Nasim1801/physio-ai-final/blob/7dc8dbd9a4b72e7e145393d2a6cb8fc516b89f42/train_model.py)

| Metric                                      |       Dissertation |    One local rerun |
| ------------------------------------------- | -----------------: | -----------------: |
| Random Forest accuracy                      |             96.23% |             96.24% |
| SVM accuracy                                |             91.88% |             91.88% |
| Logistic regression accuracy                |             81.71% |             81.64% |
| Random Forest macro precision / recall / F1 | 0.96 / 0.95 / 0.96 | 0.96 / 0.95 / 0.96 |

The rerun used Python 3.11.9, NumPy 2.4.2, pandas 3.0.1 and scikit-learn 1.8.0 on an isolated copy of the public revision. It establishes approximate reproduction with owner-held feature data. The public clone alone lacks the original features and model artifacts.

I tracked the retraining script’s additions back to rows of the archived input CSV. **3,390 of 7,153 test rows** had an input-row ancestor present in training. The CSV has no participant, video or session key, and this count cannot detect other related rows from the same recording. Participants are shared across the experiment because the source is one person. Independent-session performance remains unverified. The archived figure generator builds confusion counts from rounded recall and distributes remaining errors, and draws its ROC curves from synthetic scores. Those visuals cannot establish empirical confusion counts or AUC. A clean follow-up would split recordings or participants before augmentation and preserve row IDs, actual predictions and run provenance.

The public geometry and SQLite smoke example passed. The upstream test script reported 14 pass lines and zero failures on host retry with a throwaway local account database and the rerun model artifacts. One of those lines is the script’s no-pose skip. The webcam browser path was outside this run. The [GitHub-ready README](docs/physio-ai/README.md) documents dependencies, run prerequisites, verification and evaluation. A matching copy was prepared in the separate local Physio-AI checkout.

## CO2 Tracker

The public repository exposes the React prototype, and the university checkout contains working Spring Boot, JPA and H2 code. The coursework history attributes the integrated name, barcode, upload and search-history change to the candidate’s account. The surrounding deliverable is team work. The photo path was a simulated lookup, and the service used an exact case-insensitive name match and a separate typed barcode lookup. The public prototype remains independently inspectable. [React prototype](https://github.com/Nasim1801/co2-tracker) · [Recorded university demo](https://youtu.be/2qtJxDQObb4)

I built an isolated copy of the authentic team service with Java 21 and Spring Boot 3.4.4. The existing single Spring startup test passed with a Mockito JVM agent in the local environment. A separate HTTP check ran the service on localhost with an in-memory H2 override. The catalogue returned HTTP 200 with 12 products, a mixed-case Laptop search returned HTTP 200 with three rows, a seeded barcode returned HTTP 200 with one Laptop, and unknown names and barcodes both returned HTTP 404. Static review established the timestamped JPA history write. The HTTP assertions cover lookups, and the existing startup test establishes that the Spring context loads. Neither assertion set checks persisted history after a service restart.

For authorised team-checkout holders, run the service with an in-memory H2 override and send `GET /api/products/search?name=lApToP` to localhost. Check status and row count, then repeat with a deliberate missing product. The public case gives the observed outcome and scope. Team source, private URLs, datasets, output records and build artifacts remain outside the review branch.

## Release gate and measured portfolio checks

The Pages workflow runs on pull requests targeting `main` and on pushes to `main`. It requires lint, Lab unit tests, the TypeScript production build, and Chromium checks of rendered routes, navigation, same-origin links and fragments, accessibility and CV downloads. Only a passing run on `main` can upload and deploy Pages artifacts. The review branch exercises the gate without entering the deploy job. The default axe-core version is locked. CI verifies first-party routes and links. External project URLs are smoke-checked separately to keep third-party auth walls and outages out of the deployment gate.

Local format, lint, TypeScript, production build and rule tests passed. Chrome ran 90 route, viewport and theme checks across all nine routes. The run covered 36 axe scans with zero violations and 136 same-origin links or fragments. Browser assertions also verify the evidence jump links, all three CV downloads, the static fallback CV link, gallery keyboard controls, mobile navigation and the Engineering Lab rule and reset. GitHub’s review run is recorded in the pull request.

## Recruitment re-evaluation

These scores are simulated hiring judgments. The audit column comes from the original recruitment report. The before column assesses the Phase 1 production build, and the after column assesses the verified Phase 2 preview. Differences in visual and employment scores from the original audit mainly reflect Phase 1.

| Original category                | Original audit | Phase 1 before | Phase 2 after |
| -------------------------------- | -------------: | -------------: | ------------: |
| First impression                 |            7.5 |            8.0 |           8.0 |
| Professional credibility         |            6.5 |            7.5 |           8.0 |
| Visual design                    |            7.0 |            7.0 |           7.0 |
| Typography                       |            7.5 |            7.5 |           7.5 |
| User experience                  |            7.0 |            7.5 |           8.0 |
| Mobile experience                |            6.5 |            7.5 |           7.5 |
| Project quality and presentation |            7.5 |            7.5 |           8.0 |
| Engineering credibility          |            7.0 |            7.0 |           8.0 |
| Technical communication          |            6.5 |            7.0 |           8.5 |
| Recruiter readability            |            6.5 |            7.5 |           8.0 |
| Job-market positioning           |            6.5 |            7.5 |           7.5 |
| Overall application readiness    |            6.5 |            7.5 |           8.0 |

- **Graduate software engineering recruiter.** I would shortlist. Phase 1 already clarified the job target and releases. The Phase 2 evidence links make it faster to identify testing habits and explain what the candidate personally contributed.
- **Junior iOS hiring manager.** I would invite an initial technical conversation. PathLife gives a concrete lifecycle and persistence discussion with a checked Swift seam. The two App Store releases still carry the strongest independent evidence. I would ask the candidate to walk through a personally authored Swift change and a native regression test in the interview.
- **Junior full-stack hiring manager.** I would consider a screen for a graduate role. The real local Spring/H2 outcomes and the public Python WebSocket/SQLite implementation strengthen the application. For a backend-heavy role I would want a shareable PR, contract test or runnable service with attributable changes.

The main Phase 2 improvement is verifiability. Reviewers can reach code or a clearly scoped test from each case, and the Physio-AI write-up qualifies its headline result with evidence about the actual split. Native Sumlume verification and an independently reproducible grouped ML evaluation remain open evidence gaps.
