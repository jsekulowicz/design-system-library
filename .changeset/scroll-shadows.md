---
"@jsekulowicz/ds-components": patch
---

`ds-dialog`, `ds-drawer`: replace the scroll-driven mask fade with CSS scroll
shadows (background gradients with `background-attachment: local` cover layers).
This removes the dependence on a scroll-progress timeline, which some engines
park at an extreme keyframe on non-scrollable content — painting a phantom fade
(e.g. a dialog whose scrollable form is replaced by a short confirmation). The
covers sit over the shadows when content fits, so a panel that doesn't scroll
shows nothing, with no JS and no timeline. Tunable via `--ds-scroll-shadow-color`
/ `--ds-scroll-shadow-cover` / `--ds-scroll-shadow-size` /
`--ds-scroll-shadow-cover-size`. `ds-table` keeps its mask fade (opaque rows
would hide a background shadow).
