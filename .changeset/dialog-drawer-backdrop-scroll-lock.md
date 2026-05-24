---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog` and `ds-drawer` now also block scrolling when the user wheel-scrolls / touch-drags *over the backdrop* (not just inside the body). Previously the body had `overscroll-behavior: contain` which caught chains from the inside, but events that originated on the backdrop hit the dialog element itself — which has `overflow: visible` and is therefore not a scroll container, so `overscroll-behavior` didn't apply — and bubbled up to whichever ancestor scroll container the dialog sat in (often the page's `main`). Added a wheel + touchmove listener that cancels events whose target is the dialog element itself; events bubbling up from the body still proceed so the body's own scrolling works normally.
