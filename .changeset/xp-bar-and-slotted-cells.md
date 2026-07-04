---
"@jsekulowicz/ds-components": minor
---

Progress bar and table refinements:

- `ds-progress-bar`: the label is now bare text (no chip) that **auto-flips colour at the fill boundary** — `--ds-color-bg` over the filled track, `--ds-progress-color` over the empty track — via a hard-stop gradient painted through the glyphs (`background-clip: text`), so it stays legible without any outline (works per-glyph, mid-letter). Inline icons keep their own colour, so give them their own contrast (a badge/pill). A single `--ds-progress-color` custom property (default `--ds-color-accent`) recolours the track border, the filled indicator and the label together; the empty track is `--ds-color-bg`. The default label size is now `sm` (was `xs`). The border is painted on top of the fill and the indicator no longer rounds its own corners (the track clips them), so rounded tracks no longer show a seam between the fill and the border at the corners. (The flip is left-to-right; RTL is not yet handled.)
- `ds-table`: each cell is now rendered inside a `cell:{columnName}:{rowKey}` named slot (with the column's `render`/`field` as fallback), so consumers can project framework-rendered cell content. Requires `row-key` to be set; tables without it are unchanged.
