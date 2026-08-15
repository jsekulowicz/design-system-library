---
'@jsekulowicz/ds-components': patch
---

Fix `ds-table` stacked cells centering their label and value independently, so a two-line label sat visibly lower than the three-line value beside it. Label and value now start on the same line, while a row whose content is shorter than the 40px minimum stays centered in it.
