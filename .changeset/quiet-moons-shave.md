---
'@jsekulowicz/ds-components': patch
---

Center short values in `ds-table` stacked cells. A value shorter than a line box - an icon scale, a rating - was pinned to the top of its row and read as lifted next to its label. Stacked cell content now reserves one line box, so a short value centers on the label's line while wrapped text still starts on the label's first line.

Give the action cell of a stacked row - the one with no label, holding a delete or remove button - its full vertical padding back. It is the last row of the card and buys legibility for the height.
