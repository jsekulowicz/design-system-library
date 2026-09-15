---
'@jsekulowicz/ds-components': minor
---

The "+n" tile on `ds-select` and `ds-searchable-select` can now show what it is
hiding. Fill the new `overflow-tip` slot and the tile carries a tooltip with it:
hovering shows the tip, and tapping the tile focuses it so the tip stays up
until the reader clicks or tabs away. Left empty, the tile behaves exactly as
before, and `ds-overflow-click` still fires either way for consumers that would
rather open something of their own.

`ds-tooltip` no longer opens when nothing filled its `tip` slot. It was showing
an empty bubble on hover, which is what made an always-rendered tooltip around
the tile impossible to add without it.
