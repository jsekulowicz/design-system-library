---
'@jsekulowicz/ds-components': minor
---

`ds-card` reads three new CSS variables: `--ds-card-padding` (default `--ds-space-6`), `--ds-card-gap` (default `--ds-space-4`) and `--ds-card-border-color` (default `--ds-color-border`). Small cards, such as tiles in a row, can now set their padding and border color without `::part(card)` overrides. The `interactive` hover border color still applies on top of a custom border color.
