# V7 changelog

Written for Nasim. V7 is a small, focused change to V6 on branch `redesign-v7`. Everything else in V6 is as it was.

To see it without deploying, watch `review/v7-scroll.mp4` (the first ten seconds stay on the hero so you can see the stage rotate) and look at `review/v7-moment-*.png`.

## What changed

### The hero now shows all four projects, not one puzzle

The Make 10 board made the first screen look like a Sumlume site. In its place is a "Choose a level" stage:

- A stage rotates through PathLife, Sumlume, Physio-AI and PawLife every four seconds. Each shows its real screenshots (Physio-AI shows the live tracking view), its name, what it is, and its status: "Live on the App Store", "Graded A" or "In development".
- Four level tiles under the stage pick a project directly. The active tile has a small timer bar.
- Clicking the stage takes you to that project further down the page.
- The stage's colours, and the glow behind the hero, follow the project on show.
- On desktop the stage tilts with the pointer and pauses while you point at it. On a phone you can swipe it. On a keyboard the arrow keys move between levels. There is a pause button.
- With reduced motion switched on, it stays on PathLife and does not rotate.
- Only the first screenshot loads with the page; the rest load just after.
- On a phone the stage is compact and sits below the name, role, buttons and badges.

Your name entrance, role label, buttons, badges and drifting tiles are unchanged.

### Make 10 now lives inside Sumlume

The board is in a "Playable demo" panel directly under the Sumlume project on the home page, titled "Play it here". It plays exactly as before: bursts, progress bar, win screen. The win screen now offers "More about Sumlume" and "Download CV", and still links to the harder version in the Lab. Two small examples next to it show the rule (7 and 3 make 10; 5 and 5 match).

### Drifting tiles no longer sit behind text

In the hero and the contact section, tiles now fade out before they reach the name, role, description, buttons, badges, the contact heading, text and menu. They still drift in the open space around them. This applies to both themes, on desktop and phone. On a phone there is little open space in those sections, so you will see fewer tiles there.

### Copy

Only wording that referred to the board in the hero changed: the board's own heading and win message, and two sentences in the "This portfolio" case study.

## Checks

Lint, format, the puzzle tests, the build and the browser checks all pass. The browser checks now cover the hero stage (rotation, pause, arrow keys, the link to the project, the reduced-motion version) and the board in its new place.
