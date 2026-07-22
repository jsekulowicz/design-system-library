---
'@jsekulowicz/ds-components': minor
---

`ds-bar-chart`: horizontal x-axis tick labels now stay inside their band — wrapping once at a word boundary and ellipsizing anything past two lines (the tooltip keeps the full title) — and a new `barColor(domain, seriesKey)` property lets single-series charts color-code bars per category, falling back to the series color.
