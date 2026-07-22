---
'@jsekulowicz/ds-components': minor
---

`ds-bar-chart`: horizontal x-axis tick labels now stay inside their band — rendered in a band-wide HTML label that wraps at word boundaries and line-clamps to two lines with an ellipsis (the tooltip keeps the full title) — and a new `barColor(domain, seriesKey)` property lets single-series charts color-code bars per category, falling back to the series color.
