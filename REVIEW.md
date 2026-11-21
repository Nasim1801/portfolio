# Portfolio V2 review

Reviewed on 21 November 2026 as a London technical recruiter screening graduate and junior candidates, then as an engineering hiring manager assessing implementation evidence.

## Before

### 30-second recruiter check

At 1440px, the previous homepage showed real work and strong visual craft, but the first screen did not make Nasim’s full target role, education and best evidence land as one clear story. The strongest projects were separated by several explanatory sections, the page was unusually long, and there were no dedicated project URLs for a hiring manager to share or revisit.

At 390px, the identity and availability were present but competed with a long headline and a dense visual composition. The CV action was less prominent than it should be for a job-search portfolio.

The existing site already had important strengths: real screenshots, a working CV, an App Store release, a specific 96.23% machine-learning result, good keyboard foundations and honest prototype wording.

### Before scorecard

| Area                              | Score | Reasoning                                                                                                       |
| --------------------------------- | ----: | --------------------------------------------------------------------------------------------------------------- |
| First impression and clarity      |  7/10 | Strong work, but the role and proof hierarchy took too long to resolve.                                         |
| Visual design and consistency     |  8/10 | Distinctive and crafted, with too many competing treatments and very long sections.                             |
| Project presentation and evidence |  8/10 | Real screenshots and numbers were strong, but there were no dedicated case-study URLs.                          |
| Technical credibility             |  7/10 | Good implementation detail, but architecture, responsibility and trade-offs were inconsistent between projects. |
| Writing quality and tone          |  7/10 | Specific and human, but repetitive and too long for a first scan.                                               |
| Contact and calls to action       |  8/10 | Contact details worked, but the CV needed more prominence.                                                      |
| Mobile experience                 |  7/10 | Responsive, but the first screen and page length asked too much of a recruiter.                                 |
| Accessibility                     |  8/10 | Good semantics and keyboard intent, with contrast and target-size issues remaining.                             |
| Performance                       |  8/10 | WebP and lazy loading helped, but the hero motion bundle and oversized responsive assets added cost.            |
| SEO and link sharing              |  7/10 | Root metadata existed, but project routes, route-specific metadata and sitemap entries did not.                 |

## Issues found and resolved

### Delete

1. **Repeated proof and long pre-project narrative**
   Location: former homepage section order in `src/components/Sections.tsx`.
   Fix: removed repeated strengths and studio exposition from the recruiter path. Selected work now follows the hero and proof strip directly.
2. **Weak or unavailable public actions**
   Location: project links in `src/data/content.ts`.
   Fix: removed the idea of exposing unverified private source links. Only verified App Store, product, demo and public GitHub links render.
3. **Unavailable PawLife gallery slots**
   Location: PawLife case study in `src/data/content.ts`.
   Fix: unavailable minigames-list and share-card captures are not shown as evidence.

### Add

1. **Sumlume as the lead product**
   Location: `public/assets/sumlume/`, `src/data/screens.ts`, `src/data/content.ts`.
   Fix: added the real icon and published screenshots, verified iOS status, honest Kotlin Android status and a full engineering case study.
2. **Dedicated case-study pages**
   Location: `src/components/CaseStudyPage.tsx`, `src/App.tsx`.
   Fix: added shareable pages for Sumlume, PathLife, Physio-AI and PawLife with role, stack, architecture, decisions, evidence and next-project navigation.
3. **Static search metadata for every route**
   Location: `scripts/generate-static-routes.mjs`, `public/sitemap.xml`.
   Fix: each case study now receives a unique title, description, canonical URL, social image and structured-data object in its generated HTML.
4. **Complete verified professional history**
   Location: `src/data/content.ts`.
   Fix: added the previously omitted ATOZ Education Services role and aligned education, dates and language levels with the CV.
5. **Reproducible browser QA**
   Location: `scripts/qa-portfolio.ts`.
   Fix: added a 40-case viewport/theme matrix plus keyboard interaction checks.

### Update

1. **Hero recruiter clarity**
   Location: Hero data and layout in `src/data/content.ts` and `src/components/Sections.tsx`.
   Fix: the first screen now states name, London, target roles, two live App Store products, the Grade A Physio-AI result, contact and CV access.
2. **Project order and depth**
   Location: selected work in `src/data/content.ts`.
   Fix: ordered the evidence as Sumlume, PathLife, Physio-AI and PawLife. The two live products now lead.
3. **Founder positioning**
   Location: About and Contact copy in `src/data/content.ts`.
   Fix: PathLife Studio is presented as evidence of ownership and release experience while explicitly stating the search for a graduate or junior role in London.
4. **Visual system**
   Location: `src/styles/global.css` and `src/styles/site.module.css`.
   Fix: consolidated spacing, type, surfaces, radii, frames and theme behaviour into one calmer editorial product system.
5. **SEO identity**
   Location: `index.html`, `public/og-cover.*`, `public/site.webmanifest`.
   Fix: updated the site title, social cover, Person schema, natural search phrasing and install metadata.

### Fix

1. **Dark-mode contrast failures**
   Location: proof strip, project evidence, case facts and case-study panels in `src/styles/site.module.css`.
   Fix: replaced theme-sensitive mixed surfaces with contrast-safe dark panels and accent blends. Lighthouse accessibility now scores 100.
2. **Small carousel targets**
   Location: mobile gallery dots in `src/styles/site.module.css`.
   Fix: increased controls to 28px targets while retaining compact 10px visual dots.
3. **Accessible-name mismatch**
   Location: portfolio home link in `src/components/Header.tsx`.
   Fix: the accessible name now comes from the visible Nasim Mosayebi label.
4. **Duplicate section identifier**
   Location: PawLife data in `src/data/content.ts`.
   Fix: renamed the state-design section so the injected architecture section has a unique anchor.
5. **GitHub Pages deep links**
   Location: route generator and base-aware link helpers.
   Fix: generated real route entry points and retained a 404 fallback without breaking the `/portfolio/` base path.

## Founder wording decision

The site now uses this position consistently:

> Through PathLife Studio I have taken mobile products from design and implementation through App Store release, support infrastructure and ongoing maintenance. I am now looking for a graduate or junior engineering role where I can contribute that ownership within an experienced team.

This treats the studio as proof of delivery while making the job search explicit. It makes no unsupported statement about hours, visa status or availability dates.

## After

### 30-second recruiter check

- **Who, role and location:** immediately clear. Nasim Mosayebi, London, Software Engineer, Mobile Developer and Full-Stack Developer are all above the fold.
- **Strongest proof:** immediately clear. Two live App Store products and Physio-AI at 96.23% accuracy are stated before any biography.
- **Contact and CV:** immediately clear. The hero, navigation and contact panel all expose the working CV and contact routes.

### After scorecard

| Area                              | Score | Reasoning                                                                                                     |
| --------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------- |
| First impression and clarity      |  9/10 | Identity, target roles, location and strongest evidence resolve in one scan.                                  |
| Visual design and consistency     |  9/10 | The system is calm, distinctive and consistent across homepage and case studies.                              |
| Project presentation and evidence |  9/10 | Four major projects have real media, exact responsibility and shareable technical narratives.                 |
| Technical credibility             |  9/10 | Native mobile, cross-platform, full-stack and applied-AI evidence is concrete and appropriately scoped.       |
| Writing quality and tone          |  9/10 | Copy is concise, specific, British English and free of unsupported claims.                                    |
| Contact and calls to action       | 10/10 | CV, email, LinkedIn and GitHub are visible, copyable and repeated at sensible decision points.                |
| Mobile experience                 |  9/10 | The page is clear at 360px with no horizontal overflow and keyboard-friendly galleries.                       |
| Accessibility                     | 10/10 | Lighthouse 100, visible focus, reduced motion, semantic landmarks, focus trapping and adequate touch targets. |
| Performance                       |  8/10 | Case-study performance exceeds 90, but the long homepage measured 88 on the mobile Lighthouse profile.        |
| SEO and link sharing              | 10/10 | Unique static metadata, canonical URLs, structured data, sitemap, robots and social art are present.          |

## Verification

- TypeScript production build: passed.
- ESLint with zero warnings: passed.
- Prettier check: passed.
- Automated Chrome matrix: 40 route, viewport and theme combinations passed at 360, 768, 1280 and 1600 pixels.
- Mobile menu: opens, closes on Escape and restores focus.
- Lightbox: opens, supports arrow keys, traps focus and closes on Escape.
- Browser console and page errors: none in the automated matrix.
- Horizontal page overflow: none in the automated matrix.
- App Store, PathLife Studio, GitHub and YouTube links: returned HTTP 200. LinkedIn returned its automated-access block (HTTP 999) and should be checked manually in a signed-in browser.
- Homepage Lighthouse mobile: Performance 88, Accessibility 100, Best Practices 100, SEO 100.
- Sumlume Lighthouse mobile: Performance 93, Accessibility 100, Best Practices 100, SEO 100.

The homepage performance score is the only measured target below 90. Its lab LCP was 3.8 seconds with zero total blocking time and 0.01 cumulative layout shift. The main remaining cost is the long client-rendered React page and its visual product evidence. This is documented rather than overstated.

## Recruitment assessment

The portfolio now justifies a serious interview screen. The differentiator is not merely that Nasim has student projects. It is that he has released two mobile products, handled production and review work, built supporting infrastructure and can explain the systems behind the products. Physio-AI broadens the evidence beyond games, while the team projects show Java, Spring Boot, React, testing and Scrum contribution.

The main hiring-manager weakness is limited public source evidence for the proprietary game work. The public Physio-AI and university repositories help, but a small sanitised code sample or technical article would strengthen the mobile-engineering case further.

## Questions for Nasim

1. Can you add or grant access to this property in Google Search Console so the sitemap can be submitted and indexing can be inspected?
2. Do you want to publish a sanitised mobile code sample or architecture excerpt for Sumlume, PathLife or PawLife without exposing private project code?
3. The current CV profile is more postgraduate-AI focused than the portfolio’s graduate software-engineering job search. Would you like the CV wording aligned in a separate document update?
4. If you capture the PawLife minigames-list and share-card screens, they can be added to the existing gallery manifest without changing the case-study layout.
