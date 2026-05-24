---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog`'s header close button is now a `ds-button` (variant=ghost, size=md, square) with the `x-mark` icon instead of a hand-rolled `<button>` + inline SVG. Same `part="close-button"` exposure, same `Close` aria-label, and clicks still emit `ds-close` with `{ returnValue: 'close' }`. Visual upshot: the hit area grows from 32px to ds-button's sm size, hover / focus / disabled states match every other action in the system, and the button sits closer to the card's top-right corner via negative margin offsets that absorb part of `ds-card`'s padding instead of leaving the X stranded mid-padding. The X icon's size is now 2xl.
