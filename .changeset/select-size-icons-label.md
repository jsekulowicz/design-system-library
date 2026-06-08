---
"@jsekulowicz/ds-components": minor
---

Enhance `ds-select` and `ds-searchable-select` with sizing, option icons, and a leaner empty-label layout.

- **Size**: add a reflected `size` property (`sm` | `md` | `lg`) that drives the trigger height via `--ds-select-size`, matching `ds-button` sizing. Defaults to `md`.
- **Option icons**: `SelectOption` gains an optional `icon` field (`{ name: string; color?: string }`). The icon renders in the dropdown option rows, in the `ds-select` trigger for the selected value, and as a leading adornment in the `ds-searchable-select` trigger. Per-option `color` customizes the icon color.
- **Selected icon overrides the leading slot**: when a single option with an icon is selected, its icon takes precedence over any consumer-provided `slot="leading"` content (consistent across both components).
- **Multi-select tiles**: each selected tile shows its option's icon (`ds-icon`, `size="md"`), and the tile remove control now uses `ds-icon name="x-mark"` (`size="sm"`).
- **Empty label**: when `label` is empty the `<label>` element is no longer rendered, removing the `4px` label gap and reducing the component's overall height.
- **Search re-entry fix** (`ds-searchable-select`): typing or pressing Backspace while the input keeps focus but the dropdown is closed (after pressing Escape or selecting an option) now re-enters search mode instead of swallowing the keystroke — starting from an empty query (Backspace/Space) or the typed character.
