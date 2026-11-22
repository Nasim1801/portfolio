# V9 changelog

Written for Nasim. V9 fixes the drifting objects behind the hero and the contact section, on branch `redesign-v9`. Nothing else changed.

You were right about the live site: on a wide screen the objects overlapped, bunched up, and were bright enough to compete with your name and the stage. They are now a quiet background layer.

To see it without deploying, watch `review/v9-scroll.mp4` (the first twenty seconds stay on the hero) and look at `review/v9-moment-hero-level-*-2560-*.png` for the very wide screen.

## What changed

- **Every object has its own place.** Objects are placed with a fixed minimum distance between them, spread evenly across the open space. Each one bobs gently around its own spot instead of travelling across the screen, so two objects can never overlap or bunch up.
- **Far fewer, with a hard limit.** The hero never shows more than 16 objects and the contact section never more than 12, however wide the screen. Before, a laptop screen had about 72 in the hero and a very wide screen about 78.
- **Smaller and fainter.** Objects are roughly a third smaller and about half as strong, and the far layer is fainter still. Nothing is as loud as a button or a badge.
- **Clear zones.** Objects stay away from your name, the text, the buttons, the badges, the stage and its level tiles, the header, the scroll arrow and the level map on the right edge.
- **Even mix.** Neighbouring objects are always different shapes and different colours, so you no longer get two hearts or two paws side by side.
- **Pointer.** An object leans a little away from the pointer and then returns to its spot.
- **Level changes** still swap the objects for the new project's set, now in place, in a wave from left to right.
- **Hero height.** The hero is slightly shorter on large screens, so there is no empty band under the badges.

Unchanged: the four themed sets, the mix in the contact section, stopping when off screen, the still picture for reduced motion, and hiding from screen readers.

## On phones

A phone hero is nearly all text, so only one to four objects fit, in the band above the stage and near the scroll arrow.

## Checks

Lint, format, the puzzle tests, the build and the browser checks all pass. The browser checks now prove, at 1440 and 2560 pixels wide, that no two objects overlap, none sits in a protected zone, and the count stays within the limit.
