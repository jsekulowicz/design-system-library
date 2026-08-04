---
'@jsekulowicz/ds-components': patch
---

Measure the listbox row instead of assuming 36px, so long option lists stop drifting.

The virtual list reserved `ITEM_HEIGHT = 36` per unrendered row, but nothing pins an option to that height: no line-height is set anywhere in the option chain, so the row follows the font's metrics — 37.5px in Chrome at the default size. Every row was 1.5px shorter than the space reserved for it, and the error compounded: over 200 options the listbox came up 280px short, leaving the last rows unreachable and the visible window increasingly out of step with the scroll position. Projected option content could shift the height again.

Both selects now measure a rendered row and feed that height to the spacers, the focus-into-view maths and the `ds-scroll-end` threshold, re-measuring whenever the listbox re-renders. `36` stays as the estimate used before the first measurement. Rows still have to be uniform — an option whose text wraps is taller than its neighbours, which no fixed-height virtual list can track.
