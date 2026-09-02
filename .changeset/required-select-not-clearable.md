---
'@jsekulowicz/ds-components': minor
---

`required` no longer implies a clear button on `ds-select` and
`ds-searchable-select`. Required says a value must be there, so offering
one click to take it away worked against the field's own rule; re-picking
is what a select is for. Set `clearable` alongside `required` to keep it.
