---
'@jsekulowicz/ds-components': minor
---

`ds-button` accepts `href`, `target` and `rel`, rendering an `<a part="button">` instead of a `<button>`.

Wrapping a `ds-button` in a router link or an `<a>` produced two tab stops: the outer anchor, then the shadow `<button>`, which are both focusable. Keyboard users had to press Tab twice to get past one control, and the focus ring changed appearance between the two. Setting `href` now renders the anchor inside the shadow root instead, so a button-shaped link is a single tab stop with the standard focus ring.

`part="button"` and the `.btn` class are unchanged, so `::part(button)` consumers keep working. In link mode `type` is ignored and the button never submits or resets a surrounding form.
