---
'@jsekulowicz/ds-components': minor
---

`ds-table` now scrolls back to the top when a slotted `ds-table-pagination` emits `ds-page-change`, so a new page always starts at its first row. In `scroll-body` mode the body scroller is reset; otherwise the table is brought back into view.
