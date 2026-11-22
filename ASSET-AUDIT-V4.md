# V4 asset audit

Verified on 22 November 2026. The released games use iPhone artwork from the UK App Store. PawLife uses iOS development-build captures from the local QA archive.

| Project  | Verified version or capture           | Source and selection                                                                                                                                                                                                                       |
| -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sumlume  | iOS 2.0.0, published 16 November 2026 | Apple UK listing and lookup metadata. iPhone artwork positions 1, 10, 5, 9, 8 and 6 show the Classic board, home, Daily Challenge, achievements, statistics and collection. The current Apple application icon came from the same listing. |
| PathLife | iOS 2.1.3, published 7 November 2026  | Apple UK listing and lookup metadata. Positions 1, 4, 9, 5, 3, 6 and 8 show the life dashboard, an event, relationships, career, education, business and property. The logo came from the production AppIcon file served by Apple.         |
| PawLife  | Native iOS QA, 17–18 November 2026    | Home and companionship came from the 18 November moment-button QA pass. Creation, shelter, neighbourhood, beach and ageing came from the 17 November native QA passes. The portfolio labels PawLife as in development.                     |

[Sumlume on the UK App Store](https://apps.apple.com/gb/app/sumlume-number-match/id6799957684) · [PathLife on the UK App Store](https://apps.apple.com/gb/app/pathlife/id6769602618) · [Apple UK version and iPhone artwork metadata](https://itunes.apple.com/lookup?id=6769602618,6799957684&country=gb)

## PathLife branding

The local sources included a 1.0 SwiftUI catalogue, a 2.0 project and a separate 2.2 workspace. Apple’s production icon is authoritative for the released game. The portfolio uses it everywhere PathLife is represented visually. The publisher is identified in text and links to the studio site.

## PawLife capture provenance

The paths below are relative to the PawLife QA output directory.

- `moment-button-2026-11-18/native/fresh-bella-year4-waiting-home.png`
- `moment-button-2026-11-18/native/fresh-bella-year4-button-started-session.png`
- `final-gameplay-2026-11-17/native/pip-new-life-action-album-retained.png`
- `player-review-2026-11-17/native/cat-shelter-fresh-beginning.png`
- `player-review-2026-11-17/native/cat-story-choice-direct-outing.png`
- `player-review-2026-11-17/native/dog-free-beach-normal-play.png`
- `player-review-2026-11-17/native/rabbit-age-up-review.png`

The PawLife project audit documents later changes through 20 November and records web validation for those changes. The portfolio uses the latest suitable native captures found during this review. The older manifest’s dedicated minigames list and standalone share card were removed. A native QA screenshot showed the operating-system share sheet, so the gallery instead uses the app’s own gameplay and progression screens.

## Media pipeline

- Store marketing artwork retains its full composition and is displayed as a print, with the device framing already present in the original. Native PawLife captures use a slim CSS device frame.
- Game screens use 112-pixel thumbnails, 540-pixel WebP display variants and native-resolution WebP masters. The gallery uses intrinsic dimensions, descriptive alt text, lazy loading for secondary media and an independent full-resolution viewer.
- Sumlume’s native source workspace and a current raw PathLife 2.1.3 simulator run were unavailable as image sources. The UK production listings provided the selected evidence.
- The portfolio’s own case study uses a fresh 1600 × 1000 Chromium capture of V4. The university project images are existing project evidence.
