---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog` and `ds-drawer` no longer leak scroll to the page behind them. Wheel/touch scrolling at the top of the body when there's nothing above (or in a body that doesn't overflow at all) used to chain up to the document and shift the underlying page, even though the modal itself was on top. Added `overscroll-behavior: contain` on the scrollable body part — the scroll stops at the modal's boundary instead of escaping to whatever's behind it.
