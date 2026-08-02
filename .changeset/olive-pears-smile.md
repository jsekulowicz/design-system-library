---
'@jsekulowicz/ds-components': patch
---

Fix `ds-fieldset` laying its controls out in a column, and expose the row as a part.

`.items` inherited `flex-direction: column` from the shared field-group styles and never reset it, so a horizontal fieldset silently stacked its controls and `align-items: flex-end` shrank them to their content width. The direction is now explicit, `align-items` is `flex-start` so controls of different heights line up on their labels rather than their footers, and `part="items"` lets consumers restyle the row.
