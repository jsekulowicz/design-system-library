---
'@jsekulowicz/ds-components': patch
---

`ds-alert`'s dismiss button now uses `ds-button` and `ds-icon` instead of a raw
`<button>` wrapping an inline SVG, so it matches `ds-dialog` and `ds-toast` —
same ghost/sm/square button, same `x-mark` at `2xl`, and the same focus ring and
hit area every other close button has.

It also exposes a `close-button` CSS part, matching the other two.

Consumers styling the old internals via `::part(alert) button.close` need to
move to `::part(close-button)`; the `.close` class no longer exists.
