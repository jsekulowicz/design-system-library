---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog` and `ds-drawer` body now scrolls when content overflows the modal's height cap. The previous `ds-card::part(card) { height: 100%; max-height: 100% }` chain didn't resolve reliably through `ds-card`'s `display: block` host — when the percentage broke, `.card` sized to its content, the body's `flex: 1 + overflow-y: auto` had no height to scroll against, and overflowing content painted outside the dialog. Replaced both percentages with an explicit viewport-based cap (`min(90vh, 720px)` for dialog, `100dvh` for drawer) so the body always has a constrained parent height to flex inside of.
- `ds-dialog` now also has an 8px minimum horizontal gutter on narrow viewports. Switched `width: 100%` to `width: calc(100% - var(--ds-space-4))` — native `margin: auto` continues to centre the dialog within whatever space remains after `max-width` caps it, so wider viewports are unchanged.
