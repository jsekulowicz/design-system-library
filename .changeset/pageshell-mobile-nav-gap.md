---
"@jsekulowicz/ds-components": minor
---

`ds-page-shell`: tighten the mobile navigation drawer.

- Remove the large gap between the drawer's title row and the nav links on mobile — the sidenav now sits directly under the header (previously it was pushed down by the drawer card's inter-row gap). Desktop is unaffected.
- The mobile drawer title now matches the top bar's brand size (`--ds-font-size-lg`) instead of the drawer's larger default title.

`ds-drawer` gains two custom properties to enable this (defaults unchanged):

- `--ds-drawer-card-gap` — gap between the title row, body and footer (default `--ds-space-3`).
- `--ds-drawer-title-font-size` — title text size (default `--ds-font-size-xl`).
