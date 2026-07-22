---
'@jsekulowicz/ds-components': minor
---

Chart readability improvements:

- `ds-pie-chart` widens sub-minimum slivers to a visible sweep (`min-slice-percent`, default 1) while labels and tooltips keep the true share, keeps zero-value categories in the legend and screen-reader table when `include-zero-slices` is set, and renders legend/tooltip values as `value (percent)` instead of `value · percent`.
- `ds-bar-chart` accepts a `formatTooltipTitle` formatter so tooltip titles can carry richer text than the axis tick labels (falls back to `formatDomain`).
