---
"@jsekulowicz/ds-components": minor
---

`ds-top-bar` and `ds-footer` now wrap their content in an inner wrapper whose max-width is configurable via `--ds-top-bar-content-max-width` / `--ds-footer-content-max-width` (default `none`). Chrome (background, border, fixed height) still spans the full element width.

`ds-page-shell` sets both properties to `var(--ds-page-shell-max-width)` on the embedded top-bar and on any slotted `ds-footer`, so on viewports wider than the shell's content cap the top-bar's brand/actions and the footer's start/end regions align with the aside + main columns below.
