---
'@jsekulowicz/ds-components': patch
'@jsekulowicz/ds-core': patch
'@jsekulowicz/ds-tokens': patch
'@jsekulowicz/ds-react': patch
---

**`ds-page-shell` — symmetric scrollbar gutter on `<main>`.** When `<main>`'s content exceeds the viewport, `overflow: auto` brings in a vertical scrollbar that consumed ~14 px on the inline-end side only, leaving the inline-start padding intact. Visually the content sat off-centre — smaller left margin than right. Adds `scrollbar-gutter: stable both-edges` to `<main>` so a gutter is reserved on both inline sides regardless of whether the scrollbar is currently visible; horizontal content position stays consistent and both visual margins match.

Below the desktop breakpoint, `<main>` now uses compact responsive padding: `var(--ds-space-4) var(--ds-space-2)`. This keeps 20 px padding on desktop, while mobile and tablet layouts use 16 px vertical and 8 px horizontal padding without changing the symmetric scrollbar gutter behavior.

Page chrome padding is now aligned across `ds-page-shell`, `ds-footer`, and `ds-navbar`: header and footer regions use 20 px horizontal padding on desktop and 16 px below the desktop breakpoint.

`ds-icon` now supports `xl` (20 px) and `2xl` (24 px) sizes, and the PageShell/Navbar menu toggles use `xl` for clearer 20 px menu icons. The labeled icon role binding now uses `ifDefined` so Lit's type checker no longer reports an incompatible `role` binding.
