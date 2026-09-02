---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-react': minor
---

Make the "+n" overflow tile reachable, and harmonize where it sits.

`max-lines` clips a multi-select's tiles to a fixed number of rows and counts
what is hidden in a "+n" tile. That tile was a bare `<span>`, and keyboard tile
navigation deliberately stops at the visible tiles - so a selection scrolled
out of view could not be seen or removed at all, by mouse or by keyboard. It is
now a real button that fires `ds-overflow-click` (detail: `{ count }`), leaving
the consumer to show the full selection however suits them. React consumers get
it as `onDsOverflowClick`.

Two fixes alongside it:

- `ds-select` rendered the overflow tile before the tile list and
  `ds-searchable-select` after it. Both now render it after, so the trigger
  reads "tiles ... +3" either way.
- Removing a tile emitted `ds-change` but never marked the host interacted or
  re-ran validation, unlike every other selection path. Emptying a required
  multi-select by removing its last tile therefore still looked valid.
