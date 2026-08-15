---
'@jsekulowicz/ds-components': patch
---

Reduce the vertical padding of `ds-table` stacked cells now that `min-block-size` sets the row height. The padding used to stack on top of that floor, so any cell holding a control near 40px tall - a progress bar, an icon button - pushed its row well past every neighbouring row. Rows of plain text are unaffected: they were already at the floor and stay centered in it.
