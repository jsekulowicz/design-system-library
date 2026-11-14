---
'@jsekulowicz/ds-components': minor
---

`ds-text-field` takes `clearable`: while the field holds a value, a button empties it, fires `input`, `ds-input` and `ds-change`, and returns focus to the input. `clear-label` names the button. The clear buttons of `ds-text-field`, `ds-select` and `ds-searchable-select` are now one ghost `ds-button` of the new `xs` size, so they share its hover and focus styles.
