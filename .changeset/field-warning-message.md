---
'@jsekulowicz/ds-components': minor
---

Every field that renders a message row gains a `warning` property: a caution
about the value it holds, outranked by `error` and outranking `description`.
It announces politely and leaves the field valid, and the tone lives in the
icon so the text keeps body-copy contrast.

Without it a consumer with something to warn about had to build the row
itself, outside the field, where it could not inherit the field's own
spacing.
