---
'@jsekulowicz/ds-components': minor
---

Let a select option render framework-owned content, and give both selects real icons.

`ds-select` and `ds-searchable-select` now render each option's label inside a `option:{value}` slot, mirroring the per-cell slots `ds-table` already uses. `ds-select` adds `selected:{value}` for its trigger and both add `tile:{value}` for the tiles of a `multiple` select — a node can only be projected once, so each surface takes its own. Every slot falls back to the label it replaces, so existing consumers are untouched, and `option.label` stays the option's accessible name. Projected content must fit the 36px row the listbox virtualises on; `ds-searchable-select` has no `selected:` slot because its single-value trigger is a text input.

**Breaking:** this replaces `SelectOption.badge`, which is removed along with the `option-badge` and `tile-badge` parts. It shipped in 0.57.0 but never worked — it passed colours as inline style on the `ds-badge` host, where the badge's own opaque background painted over them. Pass a badge through the `option:{value}` slot instead.

The hand-rolled caret and clear SVGs are now `ds-icon` `chevron-down` / `x-mark` at `xl`, as is the tile remove button and `ds-nav-group`'s chevron. Selected tiles grow to 28px with a `body-md` label to carry the larger controls.
