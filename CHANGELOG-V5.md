# V5 changelog

A plain-English summary of the V5 redesign, made on branch `redesign-v5` on 22 November 2026. The full audit and the reason for each change are in `AUDIT-V5.md`.

## What a recruiter sees now

- **The first screen answers the three questions.** Name, the role being sought ("Software engineer, mobile and full-stack"), a one-line description of what Nasim does, and three buttons: View work, Download CV and Contact. London and "Open to graduate and junior roles" sit right underneath.
- **The best evidence comes first.** PathLife, then Sumlume (both live on the App Store), then Physio-AI (Grade A) and PawLife (in development). Each project says what it is, what Nasim did, what it was built with, and links to the case study and the store or GitHub page.
- **Smaller projects no longer compete with shipped ones.** CO2 Tracker, the Hospital Appointment System and the portfolio itself are a short "More work" list.
- **Case studies are easy to scan.** PathLife and Physio-AI now follow the same headings: Problem, Constraints, Architecture, Key decisions, Challenges, Outcome and What I'd improve. Every case study opens with an "at a glance" panel for role, status, facts and stack.
- **Skills are grouped and proven.** Mobile, Front-end, Back-end and ML, and Tools and practice. Every skill links to the projects where it was used. No bars or percentages.
- **About is short.** Three paragraphs: the degree and studio, how the industrial engineering and quality assurance background shapes the way Nasim works, and the four languages.
- **Contact is impossible to miss.** A full-width band with the email address, a copy button, LinkedIn, GitHub and the CV.

## The new look

- **Identity.** A cool porcelain and indigo palette in light and dark themes, one variable typeface (Bricolage Grotesque) used at different optical sizes, and a shared spacing and type scale. The serif, the cream background, the uppercase labels and the single italic words from V4 are gone.
- **Signature interaction.** A small playable "Make 10" board in the hero, using the rule behind Sumlume: clear two tiles that match or add up to 10. Pairs that make 10 share a colour, so first-time players get a hint. It works with mouse, touch and keyboard (arrow keys), announces each move to screen readers, and is proven solvable by an automated test. It is the only decorative motion on the page and it switches off when the system asks for reduced motion.
- **Tile motif.** The same tiles appear in the logo, the favicon, status labels, architecture steps and the social sharing image, so the site reads as one product.

## Fixes

- **Links to sections now work.** Opening a link such as `/portfolio/#pathlife` previously left the page at the top, because the sections only exist after the app has loaded. The page now scrolls to the right place after it renders, on the home page and on case-study pages.
- **No unsupported numbers in headline positions.** "13 screens", "500+ assets", "5 ad networks", "16 minigames" and "4 animal types" were removed because the CV and repo docs do not back them up. Kotlin was removed from tags and structured data. These are listed for Nasim to confirm.
- **Accessibility.** All standalone buttons and links are at least 44 px on phones, focus is always visible, colours pass WCAG AA in both themes, and the copy-email action has its own status message.
- **Sharing and search.** New title and descriptions that lead with the role, a new Open Graph image and favicon, an Apple touch icon, corrected structured data and a no-JavaScript summary with contact links.

## Speed and housekeeping

- The home page now makes 17 requests and transfers about 524 kB, down from 42 requests and 753 kB. The first screen is text, so it appears before any image loads.
- The deployed site is 5.9 MB, down from 9.6 MB. PNG originals moved to `media-src/` and are no longer published. Unused images were deleted.
- Screenshots now come in sizes that match how they are shown, including small thumbnails for galleries.
- One 77 kB font file replaces three.
- Removed components that the redesign replaced. The browser QA script now runs on any machine and tests the new board, skills links and deep links. A new `npm run review` script produces the screenshots and audit report.

## What still needs Nasim

See "Owner actions" at the end of `AUDIT-V5.md`: a job-focused CV, confirmation of the flagged claims, a review of the drafted case-study sections, and a check of external links after deploying.
