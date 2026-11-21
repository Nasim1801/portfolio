# Portfolio V3 creative direction

## Audit of V2

V2 is technically sound, readable and well documented, but its visual language is too familiar. The first screen uses a conventional two-column hero. Projects repeat the same rounded-card pattern. Skills are passive lists, and most motion is decorative rather than interactive. The result proves that the content exists, but the interface itself does not yet demonstrate advanced front-end engineering.

The redesign must keep the fast recruitment path from V2 while making the portfolio a piece of engineering evidence in its own right.

## Direction A: Signal Field

A dark editorial interface organised as a connected field of real projects, technologies and evidence. The hero behaves like an interactive project constellation. Selecting a node changes the product signal, proof point and route. Project chapters use asymmetric layouts, thin technical rules, large authentic media and restrained project colour. Skills become a selectable evidence map. Motion communicates state and relationships.

- **Originality:** high. The connected-signal concept belongs to the content and works across the entire site.
- **Technical feasibility:** high. It can be built with React state, SVG and modern CSS without a heavy 3D runtime.
- **Visual impact:** high. The spatial hero and editorial project chapters are substantially different from V2.
- **Recruitment suitability:** high. Identity, roles, London, CV and strongest proof remain immediately visible.
- **Mobile usability:** high. The field reduces to a touch-friendly horizontal signal selector with no loss of content.
- **Performance:** strong. No WebGL, large animation library or scroll hijacking is required.

## Direction B: Engineering Workbench

A denser interface inspired by debugging tools, system monitors and code editors. Projects would open as resizable panels, with logs, architecture traces and technical evidence arranged like an operating console.

- **Originality:** medium to high, but the developer-console aesthetic is common in technical portfolios.
- **Technical feasibility:** high, although a convincing multi-panel system adds complexity.
- **Visual impact:** high on desktop, lower on smaller screens.
- **Recruitment suitability:** medium. Dense controls could slow a 30-second first review.
- **Mobile usability:** medium. Window metaphors become stacked cards and lose much of their point.
- **Performance:** strong, but more client state would be required for a less direct result.

## Chosen direction

**Signal Field** is the stronger direction. It gives the portfolio a recognisable identity without turning the recruitment journey into a game. It also creates one coherent interaction model for the hero, project exhibition and skills evidence. The site remains semantic and useful with JavaScript disabled or motion reduced, while richer interaction is progressively added for pointer, touch and keyboard users.

## Design principles

1. **Evidence before decoration.** Every interactive state reveals a real project, implementation detail or verified outcome.
2. **One clear route through the page.** A recruiter can understand the candidate and open the CV without interacting with the visual system.
3. **Asymmetry with discipline.** Large media, fine rules and deliberate empty space replace repeated rounded cards.
4. **Motion explains state.** Transitions show which project, technology or pipeline stage is active.
5. **The real products remain the artwork.** Screenshots stay authentic and retain device-appropriate frames.
6. **Lightweight by construction.** SVG, CSS and React state are preferred to WebGL and large dependencies.
