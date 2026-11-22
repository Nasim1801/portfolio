# V8 changelog

Written for Nasim. V8 is a small change to V7 on branch `redesign-v8`. Everything else is as it was in V7.

To see it without deploying, watch `review/v8-scroll.mp4` (the first twenty seconds stay on the hero, so all four sets and the changes between them are visible) and look at `review/v8-moment-hero-level-*.png`.

## What changed

### The drifting objects now belong to the project on the stage

Behind the top of the page, the objects change whenever the hero stage changes level, automatically or when you pick one:

- **PathLife:** hearts, coins, houses, graduation caps, briefcases, stars and keys, in the game's sky blue, blossom pink, gold and green.
- **Sumlume:** the number tiles, as before.
- **Physio-AI:** line drawings in the style of the app's pose overlay: small stick figures, bent limbs with joints, joint-angle arcs, tracking boxes and targets. Amber and teal lines with coral joints, gently pulsing.
- **PawLife:** paw prints, bones, fish, balls, food bowls and hearts, in the game's warm browns, greens and blues.

Every object is an original shape drawn in code. There are no images, emoji or copied game art.

When the level changes, the old objects shrink away and the new ones pop in, a few at a time, in under a second. Objects now rock gently instead of spinning, so houses and bowls stay upright.

Everything that was true before still is: the objects move away from the pointer, fade out before they reach text, stop when off screen, and are hidden from screen readers. With reduced motion switched on, the PathLife set is shown as a still picture and does not change.

### Contact section

The drifting objects in the contact section are now a mix of all four sets.

### Two fixes

- **Sumlume playable demo:** the left side of the panel is now properly filled: label at the top, a headline, the two rule examples as tiles, and a note at the bottom linking to the Lab.
- **Physio-AI on the hero stage:** the stage now shows a larger crop of the real screenshot, centred on the tracked squat, in a bright teal setting with a white frame. The screenshot itself is not altered beyond the crop and a slight brightness lift.

## What I did not do

The brief allowed themed objects in each project's section further down the page "if they look good". Those sections have no drifting objects today, and adding them behind the project cards would compete with the screenshots, so I left them out.

## On phones

Most of the hero on a phone is text, and objects stay out of text, so only a few are visible there: in the band above the stage and around the scroll arrow. I widened that band a little and made the objects smaller and more numerous on phones, but the effect is much stronger on desktop.

## Checks

Lint, format, the puzzle tests, the build and the browser checks all pass. The browser checks now confirm that the object set follows the level, and stays fixed with reduced motion.
