---
'@jsekulowicz/ds-components': patch
---

`max-lines` works as an attribute on `ds-select` and `ds-searchable-select`.
Lit derives the default attribute name by lowercasing, so `maxLines` answered
to `maxlines` and the documented `max-lines` set nothing at all - the tile
list rendered every row it had.
