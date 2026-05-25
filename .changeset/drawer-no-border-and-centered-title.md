---
"@jsekulowicz/ds-components": patch
---

- `ds-drawer` no longer shows a 1px white strip around the card. The previous `border-color: transparent` on `ds-card::part(card)` kept a 1px border *width*, and ds-card's white background filled the border area via the default `background-clip: border-box`. Replaced with `border: 0`.
- `ds-drawer`'s title row now vertically centres its slotted brand and close button. The h2 wrapping the title slot had its default line-height inflating the row's height, pushing content to the baseline. Made `.title-text` a flex container with `align-items: center` and `line-height: 1` so the title row collapses to the actual content height and `align-items: center` on the title row can do its job.
