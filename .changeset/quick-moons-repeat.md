---
'@jsekulowicz/ds-components': minor
---

Move the character counter into the label row, and let a dialog override the width its size sets.

- `ds-text-field` and `ds-text-area` render `4/20` right-aligned beside the label instead of below the control, so a counted field no longer spends a whole row on it. The counter is a sibling of `<label>`, not a child — inside it, a screen reader folds the count into the field's accessible name and clicking it focuses the input. New `field-header` part; the footer keeps description and error and disappears when there is neither. Unlabelled counted fields still show their counter.
- New `--ds-dialog-max-width`, mirroring `--ds-dialog-max-height`. Each `size` keeps its current value (sm 400px, md 560px, lg 800px) as the fallback, so a dialog whose content wants a narrower column can say so without reaching for `::part(dialog)`.
