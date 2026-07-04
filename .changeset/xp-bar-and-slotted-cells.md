---
"@jsekulowicz/ds-components": minor
---

Progress bar and table refinements:

- `ds-progress-bar`: the label is now bare text (no chip) with a **crisp `--ds-color-bg` outline** (`-webkit-text-stroke` + `paint-order`) so it stays legible over both the filled and empty track; inline icons aren't stroked, so give them their own contrast (a badge/pill). A single `--ds-progress-color` custom property (default `--ds-color-accent`) recolours the track border, the filled indicator and the label together; the empty track is `--ds-color-bg`. The default label size is now `sm` (was `xs`). The border is painted on top of the fill and the indicator no longer rounds its own corners (the track clips them), so rounded tracks no longer show a seam between the fill and the border at the corners.
- `ds-table`: each cell is now rendered inside a `cell:{columnName}:{rowKey}` named slot (with the column's `render`/`field` as fallback), so consumers can project framework-rendered cell content. Requires `row-key` to be set; tables without it are unchanged.
