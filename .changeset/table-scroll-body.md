---
"@jsekulowicz/ds-components": minor
---

`ds-table`: add a `scroll-body` attribute. When set, the body scrolls under a
pinned header (the `footer` slot stays pinned too). The scrollbar is hidden and
overflow is signalled by scroll-driven top and bottom fades (about half a row
deep so the cue stays visible), with the top fade offset below the header so it
dims the body, not the header. The header pins to a fixed, CSS-configurable
`--ds-table-header-height` (no JS measurement), and natural `table-layout: auto`
column widths are preserved. Headers never wrap; a width-capped column
truncates a long header with an ellipsis and a native title tooltip. The
overscroll bounce is suppressed so the rubber-band does not glitch against the
pinned header and scroll-fade. The host must be given a bounded height by its
container (e.g. `flex: 1` in a flex column).

Header and body cell padding is slightly reduced (`--ds-space-2 --ds-space-3`)
for denser rows. The scroll-driven fade used by `ds-dialog`, `ds-drawer` and
`ds-table` is now a single shared definition (`--ds-scroll-fade-top` /
`--ds-scroll-fade-bottom` + the `ds-scroll-fade` keyframes).
