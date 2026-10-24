---
'@jsekulowicz/ds-components': patch
---

`ds-table-pagination` decides its compact mode from its laid-out width before the first render, so a narrow pagination no longer paints the wide layout for one frame and then jumps to the compact one. A pagination that has no width yet keeps its current `compact` value until the ResizeObserver can measure it.
