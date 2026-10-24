---
'@jsekulowicz/ds-components': patch
---

`ds-table-pagination` decides its compact mode from its laid-out width before the first render, so a narrow pagination no longer paints the wide layout for one frame and then jumps to the compact one. The first render and the ResizeObserver both measure the border box, so the two always agree, and a pagination that has no width yet keeps its current `compact` value until it can be measured.
