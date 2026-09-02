---
'@jsekulowicz/ds-components': patch
---

The "+n" tile counts hidden tiles from the first tile rather than from the
offset parent. `ds-searchable-select` sits its tiles below a search input, and
that gap was being measured as overflow, so the badge claimed more hidden
tiles than there were.
