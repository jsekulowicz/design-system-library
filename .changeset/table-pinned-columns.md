---
'@jsekulowicz/ds-components': minor
---

`ds-table`: new `pinnedColumns` property freezes columns into a contiguous left region while the rest of the table scrolls horizontally. It takes an array of column `name`s (any column is eligible, not just the leftmost; pinning one column never pins the columns before it), gathers them on the left in their original relative order, and keeps their natural width (offsets are measured at runtime). A separator marks the boundary and a shadow fades in once the body is scrolled sideways. The region can never cover the whole viewport — pinning falls back to a plain scrolling table when it would exceed `--ds-table-pin-max-ratio` (default `0.75`) of the container. Columns can opt out with `pinnable: false`. The prop is fully controlled, so consuming apps own and can persist the value.
