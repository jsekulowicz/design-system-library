---
'@jsekulowicz/ds-components': minor
---

`ds-searchable-select` no longer opens its listbox the moment focus lands in it.
Tabbing through a form used to drop an open list over whatever followed the
field; now focus alone leaves it shut.

Every way of asking for the list still opens it: a click on the control or its
label, `ArrowDown`, and the first character typed - which clears the search
first, as it already did, so the keystroke lands in an empty input. A consumer
that relied on focus alone should call `focus()` and send `ArrowDown`, or click
the control.

Pasting or inserting text without a character keydown also opens the list and
preserves the inserted query.
