# Portfolio review

Reviewed as a London technical recruiter screening graduate and junior candidates, then as an engineering hiring manager looking for evidence of implementation skill.

## Before

### 30-second recruiter check

#### Desktop, 1440px, without scrolling

- **Who, role and location:** Partly clear. “Nasim Mosayebi” is visible in the navigation and London appears in the availability badge. The target roles are present as small chips, but the hero headline does not say “software engineer” and the candidate’s name is not part of the main reading order.
- **Strongest proof:** Clear. The hero names the live App Store release and 96.23% Physio-AI result, supported by real product screenshots.
- **Contact or CV:** Contact is clear through “Get in touch” and social links. The CV is not visible above the fold or in the navigation.

#### Phone, 390px, without scrolling

- **Who, role and location:** Incomplete. London and the target roles are visible, but only the “NM” monogram appears in the header. Nasim’s full name is absent from the first screen.
- **Strongest proof:** Present in the paragraph, but it competes with a long six-line headline. The project visuals are below the fold.
- **Contact or CV:** “Get in touch” is visible near the bottom of the first screen. There is no visible CV action and the social links fall below the fold.

### Recruiter view

The site looks crafted and credible, with better visual evidence than most graduate portfolios. The biggest screening risk is clarity. The first screen leads with a brand statement instead of the candidate’s name and target role, and the first detailed project appears only after a metrics strip, a four-card strengths section, the studio introduction and a shipping story. That delays the evidence recruiters came to see.

### Hiring-manager view

The project screenshots, implementation detail and honest explanation of the CO2 prototype are strong. The PathLife shipping story and Physio-AI pipeline show useful ownership. The main gaps are code or demo links for several projects, a missing Physio-AI recording or interface screenshot, a missing CV, and no explicit “My role” line on every individual project. Known missing media currently risks unnecessary failed asset requests.

### Scorecard

| Area                              | Score | Reasoning                                                                                                                                                         |
| --------------------------------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First impression and clarity      |  7/10 | Strong visual identity and proof, but the mobile first screen omits the full name and the role hierarchy is indirect.                                             |
| Visual design and consistency     |  8/10 | Distinctive typography, framing and colour, with some oversized type, generous spacing and repeated decorative treatments.                                        |
| Project presentation and evidence |  8/10 | Real screenshots and concrete outcomes are excellent, but important links and explicit role labels are inconsistent.                                              |
| Technical credibility             |  7/10 | Architecture and implementation details are specific, but several projects lack accessible code or demo evidence.                                                 |
| Writing quality and tone          |  7/10 | Professional and specific overall, with repeated claims and paragraphs that are too long for a first scan.                                                        |
| Contact and calls to action       |  7/10 | Email and social links are clear, but the CV is missing and not available in the hero.                                                                            |
| Mobile experience                 |  6/10 | Responsive and usable, but the first screen is text-heavy, omits the full name and pushes visual proof below the fold.                                            |
| Accessibility                     |  7/10 | Good semantics, focus styles and reduced-motion support, but the lightbox does not trap or restore focus and the menu lacks Escape handling.                      |
| Performance                       |  7/10 | WebP screenshots and lazy loading help, but app icons are large PNGs, hero images are lazy-loaded and missing assets can cause failed requests.                   |
| SEO and link sharing              |  7/10 | Title, description, social tags and Person JSON-LD exist, but the social image is SVG, LinkedIn is missing from `sameAs`, and the final portfolio URL is unknown. |

## Issues and fixes

### Delete

1. **Generic proof repeated before the projects**  
   Location: `Strengths` section, `src/App.tsx` and `src/components/Sections.tsx`.  
   Fix: remove the rendered strengths section. Its claims are already demonstrated in the project sections and experience timeline.
2. **Redundant hero slogan**  
   Location: Hero kicker in `src/data/content.ts`.  
   Fix: replace “Founder who codes · Engineer who ships” with the three target role families.
3. **Phantom Physio-AI video request**  
   Location: `ProjectVideo` in `src/components/Media.tsx` and `PhysioProject` in `src/components/Sections.tsx`.  
   Fix: remove the absent video path and show the real screenshot when supplied, otherwise show a deliberate placeholder beside the pose-tracking animation.
4. **Duplicate visual rules and excess vertical space**  
   Location: `src/styles/site.module.css`.  
   Fix: remove duplicate declarations and tighten the section and project spacing scale.

### Add

1. **Full name in the hero reading order**  
   Location: Hero, `src/components/Sections.tsx`.  
   Fix: add “Nasim Mosayebi” above the main headline and keep it visible at phone widths.
2. **Visible CV action**  
   Location: Hero and Contact.  
   Fix: add “Download CV” in both places. Until the PDF exists, render a clear non-broken `[TODO: add CV PDF]` state.
3. **Explicit role on every main project**  
   Location: PathLife, PawLife, Physio-AI, CO2 Tracker and Hospital sections.  
   Fix: add a short “My role” statement using only supplied facts.
4. **Code and demo evidence where missing**  
   Location: project links in `src/data/content.ts`.  
   Fix: add clearly marked placeholders for the missing PathLife, PawLife, Physio-AI and CO2 Tracker URLs. Do not create dead links.
5. **Accessible missing-media state**  
   Location: `src/data/screens.ts` and `src/components/Media.tsx`.  
   Fix: mark known missing files in data and render “Screenshot coming soon” without requesting a non-existent URL.
6. **Hiring intent in the studio section**  
   Location: PathLife Studio introduction.  
   Fix: explain that the studio demonstrates product ownership and shipping, then state clearly that Nasim is actively seeking a graduate or junior engineering role in London.

### Update

1. **Hero clarity and length**  
   Location: `content.hero` and Hero styles.  
   Fix: lead with name and target roles, use a shorter headline, and compress the proof into one sentence.
2. **Evidence order**  
   Location: section order in `src/App.tsx`.  
   Fix: show PathLife first, Physio-AI second, then PawLife and the team projects. Move the studio context after the individual work.
3. **Studio incorporation date**  
   Location: Studio and Experience data.  
   Fix: change the founder date from “2026” to “August 2026” and the timeline to “Aug 2026 – now”.
4. **Project copy for scanning**  
   Location: `src/data/content.ts`.  
   Fix: shorten long descriptions, separate role from outcome, and keep implementation details in concise rows.
5. **Mobile hero composition**  
   Location: Hero CSS.  
   Fix: reduce headline scale and spacing so identity, role, location, proof and primary actions are visible sooner.
6. **External-link security wording**  
   Location: components rendering external links.  
   Fix: use `target="_blank"` with `rel="noopener noreferrer"` consistently.
7. **Social metadata**  
   Location: `index.html` and `public/`.  
   Fix: use an optimised PNG Open Graph image, make public-asset paths respect the Vite base path, and add LinkedIn to JSON-LD `sameAs`.

### Fix

1. **Missing CV file**  
   Location: `public/Nasim-Mosayebi-CV.pdf`.  
   Fix: avoid the current broken download until the PDF is supplied.
2. **Missing Physio-AI screenshot and video**  
   Location: `public/assets/physio-ai/`.  
   Fix: show a no-request placeholder and keep the pose tracker labelled as an animation.
3. **Missing PawLife screenshots**  
   Location: `public/assets/pawlife/03-minigames-list.*` and `06-share-card.*`.  
   Fix: show deliberate placeholders without 404 requests until real captures are supplied.
4. **Missing profile photo**  
   Location: `public/assets/me/photo.jpg`.  
   Fix: omit the optional photo without requesting it.
5. **Lightbox keyboard focus**  
   Location: `Gallery`, `src/components/Media.tsx`.  
   Fix: restore focus to the opening control, trap Tab within the modal, and keep Escape and arrow-key navigation.
6. **Mobile menu keyboard handling**  
   Location: `Header`, `src/components/Header.tsx`.  
   Fix: close on Escape and return focus to the menu button.
7. **Potential dark-mode accent contrast**  
   Location: project accent text in `src/styles/site.module.css`.  
   Fix: blend section accents with the current text colour for small labels and links.
8. **Base-path-sensitive social and favicon assets**  
   Location: `index.html`.  
   Fix: use Vite’s `%BASE_URL%` token for public assets.

## Recommended studio wording

> PathLife Studio is how I prove I can own and ship products. I founded the London studio in August 2026 and build its games, web infrastructure and publishing systems. I am actively looking for a graduate or junior engineering role in London where I can contribute to a team and keep learning from experienced engineers.

This keeps the studio as evidence of delivery while making the employment goal explicit. It makes no claim about hours, visa status or a future availability date.

## Questions for Nasim

- Please supply `public/Nasim-Mosayebi-CV.pdf`.
- What are the other two languages after English and Persian?
- Is there public code for PathLife and PawLife? If not, should those projects say “Code available on request” instead of showing a TODO?
- Is there a public PawLife demo URL?
- Is there a public Physio-AI demo URL?
- Please supply a real Physio-AI interface screenshot or recording if one can be shared.
- Please supply the missing PawLife minigames-list and share-card screenshots if available.
- Please supply the final deployed portfolio URL for canonical and Open Graph URL metadata.
- Is `public/assets/me/photo.jpg` intended to be added, or should the portrait be removed permanently?
- The App Store provider name differs from your name. Should the portfolio explain the publishing arrangement or your relationship to the provider?
- Please confirm the LinkedIn profile opens correctly for you. LinkedIn returned its automated-access block during link validation, so it could not be verified by the test runner.

## After

### 30-second recruiter check

#### Desktop, 1440px, without scrolling

- **Who, role and location:** Clear. The hero now leads with Nasim Mosayebi, the three target role families and London availability.
- **Strongest proof:** Clear. The first proof sentence names the live PathLife App Store release and Physio-AI's 96.23% model accuracy.
- **Contact or CV:** Clear. Project, contact and CV actions sit together in the hero. The missing CV is shown as a deliberate TODO rather than a broken link.

#### Phone, 390px, without scrolling

- **Who, role and location:** Clear. The full name remains visible in the header and hero. The location and target roles are in the first reading sequence.
- **Strongest proof:** Clear. The shorter headline and one-sentence proof are visible before the project composition.
- **Contact or CV:** Clear. “View projects”, “Contact me” and the CV status are visible and keyboard accessible.

### New scorecard

| Area                              | Score | Reasoning                                                                                                                                        |
| --------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| First impression and clarity      |  9/10 | Name, roles, London and the two strongest proof points now land in one fast scan.                                                                |
| Visual design and consistency     |  9/10 | The hierarchy is calmer, spacing is tighter and project media uses consistent phone, browser and desktop frames.                                 |
| Project presentation and evidence |  9/10 | Real screenshots, explicit role statements, stacks and outcomes are easy to scan. A few real captures and public links still need Nasim's input. |
| Technical credibility             |  9/10 | The shipping story, ML pipeline, full-stack flow and team-project contributions give a hiring manager concrete implementation evidence.          |
| Writing quality and tone          |  9/10 | Copy is specific, concise and consistent with British English. Repeated generic claims were removed.                                             |
| Contact and calls to action       |  8/10 | Email and social details are visible and copyable, with strong actions in the hero and contact panel. The CV PDF is still missing.               |
| Mobile experience                 |  9/10 | The first screen is clearer, galleries are swipeable, targets are large enough and no horizontal page overflow occurs.                           |
| Accessibility                     | 10/10 | Lighthouse accessibility is 100. Focus, modal keyboard controls, contrast, headings, menu Escape handling and reduced motion were verified.      |
| Performance                       |  9/10 | Lighthouse mobile performance is 94 after self-hosting fonts, responsive media and deferring the Framer Motion hero enhancement.                 |
| SEO and link sharing              |  9/10 | Lighthouse SEO is 100, with complete social tags, PNG sharing art, favicon and Person JSON-LD. Canonical URL awaits the final domain.            |

### Changes applied

- Rebuilt the hero hierarchy around name, target roles, London, the live App Store release and the 96.23% Physio-AI result.
- Reordered the work so PathLife and Physio-AI appear first, then PawLife, studio context and team projects.
- Added explicit role and outcome evidence to each project, connected the verified CO2 Tracker and Physio-AI repositories, restored the supplied CO2 demo link and kept unresolved URLs as non-clickable TODOs.
- Removed the generic Strengths section, phantom Physio-AI video request, repeated copy and excess vertical spacing.
- Added honest missing-asset and missing-CV states that do not make failed network requests.
- Strengthened keyboard behaviour in the lightbox and mobile menu, corrected heading relationships, increased carousel targets and fixed dark-mode contrast.
- Self-hosted the three fonts, added responsive 640px game screenshots and 192px app icons, prioritised above-the-fold media and moved Framer Motion into a deferred hero chunk.
- Updated Open Graph and Twitter images, favicon paths, JSON-LD `sameAs` links and base-path-safe public assets.

### Verification

- Checked at 360px, 768px, 1280px and 1600px in light and dark mode.
- No horizontal page overflow at the tested widths.
- One `h1`, no heading-level jumps and all labelled sections resolve to a real heading.
- Mobile menu closes on Escape and returns focus to its trigger.
- Lightbox traps focus, supports Escape and arrow keys, and restores focus to the opening control.
- Production console: no errors or warnings.
- External links: App Store, PathLife Studio, CO2 demo and all listed public GitHub pages returned HTTP 200. LinkedIn blocked automated validation with its anti-bot response and needs a manual click check.
- Formatting, ESLint, TypeScript and the production build all pass.

### Lighthouse mobile

Recorded against the production build on 26 October 2026:

| Category       | Score |
| -------------- | ----: |
| Performance    |    94 |
| Accessibility  |   100 |
| Best practices |   100 |
| SEO            |   100 |
