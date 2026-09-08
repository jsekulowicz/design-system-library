---
'@jsekulowicz/ds-components': minor
---

A `ds-tooltip` held open by its consumer takes pointer events, so its text can
be selected and copied. A tip that follows the pointer still cannot: it sits
under the cursor, and taking the hover it is answering would make it flicker.
Only the component knows which of the two it is, which is why the rule lives
here rather than in a consumer's `::part(tooltip)`.
