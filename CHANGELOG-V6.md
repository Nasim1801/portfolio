# V6 changelog

Written for Nasim. V5 fixed the structure and the facts; your feedback was that it looked too safe. V6 keeps every word, link and verified fact from V5 and rebuilds the experience around one idea: **a portfolio that plays like one of your games and reads like an engineer's.** It lives on branch `redesign-v6`. V5 is untouched on `redesign-v5`.

To see it without deploying, watch `review/v6-scroll.mp4` (74 seconds, the home page at 1440 px) and look through `review/v6-moment-*.png`.

## What a recruiter still gets in five seconds

Name, "Software engineer, mobile and full-stack", View work, Download CV, Contact, London and "Open to graduate and junior roles". None of that waits for an animation, and all of it is there with motion switched off.

## What is new

### A bolder identity, taken from your games

- The colours now come from PathLife's sky blue, blossom pink and warm gold, and from Sumlume's tiles. Light mode is a bright sky; dark mode is a night sky.
- Soft coloured glows drift slowly behind the whole page, with a light film grain on top.
- Every featured project has its own colour world. As you scroll to PathLife the page turns sky blue and blossom, Sumlume turns cobalt and gold, Physio-AI turns teal, PawLife turns warm amber. The buttons inside each project take that project's colour.
- Buttons, cards and badges are chunky, with a solid drop edge. They press down when you click them.

### A living hero

- Your name drops in one letter at a time, each letter with its own coloured shadow. Letters hop when you point at them.
- Number tiles drift up behind the hero and move out of the way of the pointer.
- Three achievement badges pop in under the buttons: 2 games live on the App Store, Grade A final-year project, 4 languages. All three are verified.
- The Make 10 board is juicier: tiles wobble when selected, a matched pair bursts into small tiles, a progress bar fills, and clearing the board rains tiles and shows a win screen that points to the work and the CV.

### The scroll is a journey

- A thin XP bar under the header fills as you scroll, in the colour of the project you are looking at.
- On wide screens a level map on the right shows six numbered tiles (Start, Work, Skills, About, Experience, Contact) and lights up where you are. Smaller screens show a "Level 2 Work" label instead; phones show only the bar.
- Sections arrive with different movements: headings sharpen into focus, phone stages swing in from the left, text slides from the right, badges pop, cards tip up.

### Projects feel like selecting a level

- Each project has a "Level" tag and its phone screens tilt in 3D as the pointer moves over them, with a moving highlight.
- The screens cycle through your real screenshots every few seconds. There is a pause button and a row of dots.
- "Live on the App Store" has a pulsing green light.
- Physio-AI has a scanning line sweeping over its screenshot on a tracking grid.

### Game details

- **Skills are an inventory.** Point at, tab to or tap a skill and the projects that prove it light up in the project bar; point at a project and its skills light up. The plain links under each skill are still there.
- **About has a character sheet** with role, base, degree, studio and languages.
- **The timeline is a path** with coloured tiles as stops. The line fills in as you scroll along it.
- **Contact is an end screen**: a night-sky band with drifting tiles and a big menu (Email, Download CV, LinkedIn, GitHub) whose items light up with a selection arrow.
- **Easter egg:** the Konami code (up, up, down, down, left, right, left, right, B, A) rains tiles and shows a message. The footer hints at it.

### Page changes are smooth

- Clicking through to a case study no longer reloads the page. The project title glides from its card into the case-study heading (in browsers that support View Transitions; others simply switch).
- Switching theme spreads the new colours out from the toggle button in a circle.
- Case studies have the same energy: the at-a-glance panel tips in, the architecture steps appear one by one with connecting lines, the side menu highlights the section you are reading, and gallery screenshots slide in.

## What did not change

- All copy, facts, links, the project order and the case-study structure from V5.
- The flagged unverified numbers stay off the site.
- Deep links such as `/portfolio/#pathlife` still land in the right place.
- Keyboard and screen-reader behaviour. Decorative pieces (drifting tiles, level map, XP bar) are hidden from screen readers.

## Safety nets

- **Reduced motion:** if a visitor's system asks for less motion, nothing drifts, cycles, tilts or bursts, and all content is simply there.
- **Nothing can stay hidden:** content is visible by default and is only hidden for a reveal once the script is running; a second check shows anything at or above the screen. The automated test jumps to the bottom of the page and fails if anything is still invisible.
- **Phones:** the same look, with tap instead of hover. Tilt and pointer effects are desktop only.
- **Speed:** no animation library was added. The home page transfers about 537 kB in 17 requests (V5: 524 kB). Canvases stop when they are off screen. Layout shift is still zero and text contrast still passes WCAG AA in both themes.

## Files to look at

- Video: `review/v6-scroll.mp4`
- Full-page screenshots: `review/v6-after-1440-light.png`, `review/v6-after-1440-dark.png`, `review/v6-after-390-light.png`, `review/v6-after-390-dark.png`
- Moments: `review/v6-moment-*.png` (hero entrance, board burst and win, each project world, tilt, skills active, about, timeline, contact, case study)

Full-page screenshots show the ambient glows only at the top, because the glows are fixed to the screen rather than the page. The moment screenshots and the video show them as a visitor sees them.
