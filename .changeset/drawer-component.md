---
"@jsekulowicz/ds-components": minor
---

- New `ds-drawer` molecule: edge-anchored modal panel built on the native `<dialog>` element, mirroring `ds-dialog`'s API and chrome. Pinned at `side="start"` or `side="end"`, sized via `size="sm" | "md" | "lg"` (capped at `90vw` on narrow viewports), with the same sticky title row, scrolling body and footer slots, and the same `square sm` close-button affordance you get in `ds-dialog`. Inherits all of `ds-dialog`'s free benefits from the native `<dialog>`: top-layer rendering (escapes ancestor overflow/clip), focus trap, Escape-to-close, automatic `aria-modal`. Slide-in animation via CSS transform + `@starting-style`, slide-out via `transition-behavior: allow-discrete`. Body region uses the same focus-ring escape trick as `ds-dialog` (`padding-inline` + matching negative `margin-inline`) so focused full-width children's outlines paint fully. Replaces the need for bespoke teleported `<aside>` drawers in consumer apps.
