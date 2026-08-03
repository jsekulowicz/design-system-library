---
'@jsekulowicz/ds-components': minor
---

Let a select option render its label as a badge, in the listbox and on the selected tile.

`SelectOption` gains an optional `badge?: { tone?, background?, color? }`, mirroring the existing `icon?: { name, color }` — presentation passed through the data, which is what works for a virtualised listbox where slots cannot reach. `background`/`color` take raw CSS so a consumer can hand over its own custom properties (they inherit into the shadow root) without the component knowing their names; supplying a background also clears the tone's border. Options without a `badge` are unchanged.

`ds-searchable-select` keeps the badge in an additive map beside its label/icon maps, so a selected value that search has filtered out of `options` still renders formatted. New `option-badge` and `tile-badge` parts.
