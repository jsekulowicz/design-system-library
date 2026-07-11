---
"@jsekulowicz/ds-components": minor
---

Button: split intent colour out of `variant` into a new `color` prop (`accent` | `success` | `danger`, default `accent`). `variant` is now just the emphasis — `primary` | `secondary` | `ghost` — and `color` tints it: background for `primary`, border + text for `secondary`, text for `ghost`. The `accent` default leaves `secondary`/`ghost` neutral, so existing quiet buttons are unchanged.

BREAKING: the `danger` and `success` **variants** are removed. Migrate `variant="danger"` → `variant="primary" color="danger"` (and likewise for `success`); use `secondary`/`ghost` with a `color` for outlined or text-only intent buttons.
