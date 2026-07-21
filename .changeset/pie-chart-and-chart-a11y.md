---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-react': minor
---

Add `ds-pie-chart` (pie and donut) and move all charts to a shared accessibility pattern.

`ds-pie-chart` renders part-to-whole data with focusable slices, tooltips, an optional donut centre (`center` slot), long-tail grouping via `max-slices` / `other-threshold`, and `ds-slice-focus` / `ds-slice-select` events.

`ds-bar-chart` and `ds-heatmap-calendar` no longer use `role="application"` + `aria-activedescendant`. Each data point is now a real focusable element (`role="graphics-symbol"`, roving tabindex) inside an SVG exposed as a `graphics-document`, and the visually-hidden data table sits outside the graphic so browse mode can navigate it with real table semantics. No public API changes, but the rendered DOM and ARIA structure changed — consumers asserting on chart internals may need to update. Keyboard behaviour is unchanged apart from `Tab` now landing on a data point.
