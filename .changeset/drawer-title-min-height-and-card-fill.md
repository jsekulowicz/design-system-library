---
"@jsekulowicz/ds-components": patch
---

- `ds-drawer`'s `.card` now fills the dialog's full viewport height (`height: 100vh / 100dvh`) instead of sizing to its content. Fixes a regression where short drawer content (e.g. a 4-item sidenav in `ds-page-shell`'s mobile nav) caused the visible drawer to stop partway down the screen, leaving the page bleeding through below the drawer's bottom edge.
- New `--ds-drawer-title-min-height` CSS variable on `ds-drawer` so consumers can match the title row to their surrounding chrome height.
- `ds-page-shell`'s mobile-nav drawer now sets `--ds-drawer-title-min-height: 48px` and `--ds-drawer-title-padding: 0 var(--ds-space-4)` so the title row is the same height as `ds-top-bar` (48px). Before this fix the title row was visibly taller than the topbar because its block padding inflated the natural height of the slotted brand element.
