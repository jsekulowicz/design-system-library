---
"@jsekulowicz/ds-components": minor
---

Add `ds-progress-bar`, a determinate horizontal progress indicator.

- `value` / `max` drive the fill (clamped to 0–100%); the track exposes
  `role="progressbar"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow`.
- A default slot renders an optional label on a small card-like chip centred
  both ways over the bar, so the text stays legible regardless of the fill
  colour behind it. The chip is hidden automatically when no label is provided.
- The bar is `1.5rem` tall by default and filled with `--ds-color-success`.
  Both are overridable via CSS parts: `::part(track)` for height (and track
  background/radius), `::part(indicator)` for the fill colour, and
  `::part(label)` for the chip.
