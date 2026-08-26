---
'@jsekulowicz/ds-components': patch
---

Keep StatTile the same height while its value loads. The value row floored itself with `calc(font-size * line-height)`, but the line-height tokens resolve to lengths rather than ratios, so the multiplication was invalid and the declaration was dropped - the row measured 28px around the skeleton and 36px around the loaded value. It now reserves one line box.
