---
'@jsekulowicz/ds-components': minor
---

`ds-dialog` and `ds-drawer` let apps drive their own height cap, and forward the card's parts.

- New `--ds-dialog-max-height` (default `min(90vh, 720px)`) and `--ds-drawer-height` (default `100dvh`). The outer `<dialog>` and the inner card read the same property, so lowering the cap — to keep clear of phone toolbars, say — no longer leaves a card that overflows the dialog box and a body that scrolls on content that would have fitted. Prefer these over `::part(dialog) { max-height }`, which only sizes the outer box.
- The inner `ds-card` now carries `exportparts="card,body"` instead of `part="card"`. `::part(card)` therefore targets the card surface (padding, background, border, height) rather than the `ds-card` host, and the documented `::part(body)` scroll container is finally reachable. Both can be overridden from the app, which the DS's own `ds-card::part(card)` rules previously made impossible.

Breaking for anyone styling `ds-dialog::part(card)` / `ds-drawer::part(card)` today: those rules used to land on the `ds-card` host and now land on the card surface inside it.
