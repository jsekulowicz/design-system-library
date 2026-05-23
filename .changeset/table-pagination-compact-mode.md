---
"@jsekulowicz/ds-components": patch
---

- `ds-table-pagination` now adapts to narrow containers automatically. A ResizeObserver flips the new reflected `compact` attribute on whenever the host renders below ~480px. In compact mode the Previous / Next buttons collapse to icons only (their text label is hidden but stays in the DOM so consumers can re-show it via `::part(prev-next-label)`), the visible page range tightens to "first … current … last", and `sibling-count` is forced to 0. The `compact` boolean property / attribute can also be set explicitly by consumers if they want to opt into the layout at wider widths.
- `buildPaginationRange` no longer silently clamps `maxVisiblePages` up to 5. The minimum is now 3, which is what the new compact mode needs. Callers that were already passing 5+ are unaffected.
- The Previous / Next button now exposes its slotted label through a new `prev-next-label` csspart, so consumers can target the text region (e.g. to keep labels visible at narrow widths) without leaking into other parts of the button.
