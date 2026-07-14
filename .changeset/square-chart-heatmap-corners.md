---
"@jsekulowicz/ds-components": patch
---

Route the hardcoded corner radii in bar-chart and heatmap-calendar through `--ds-radius-xs` instead of literal pixel values, so consumers that zero their radius tokens get square corners.

- `bar-chart`: the keyboard focus ring rect no longer forces `rx="4"`; it reads `--ds-radius-xs` via CSS.
- `heatmap-calendar`: day cells (and their active/focus outline) and the legend swatches now read `--ds-radius-xs` instead of a fixed `2px`.
