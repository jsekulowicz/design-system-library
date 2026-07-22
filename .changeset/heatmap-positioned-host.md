---
'@jsekulowicz/ds-components': patch
---

Fix `ds-heatmap-calendar` stretching the page: `:host` now sets `position: relative` (matching `ds-bar-chart` and `ds-pie-chart`), so the absolutely positioned visually-hidden data table is contained by the host instead of the nearest positioned ancestor. Without it the 1px table wrapper landed at its static position below the heatmap, escaped overflow clipping, and could add phantom empty scroll space to the page.
