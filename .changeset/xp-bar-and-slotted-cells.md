---
"@jsekulowicz/ds-components": minor
---

Progress bar and table refinements:

- `ds-progress-bar`: the label is now bare outlined text (no chip) that stays legible over both the filled and empty track, and a single `--ds-progress-color` custom property (default `--ds-color-accent`) recolours the track border, the filled indicator and the label together. The empty track is `--ds-color-bg`.
- `ds-table`: each cell is now rendered inside a `cell:{columnName}:{rowKey}` named slot (with the column's `render`/`field` as fallback), so consumers can project framework-rendered cell content. Requires `row-key` to be set; tables without it are unchanged.
