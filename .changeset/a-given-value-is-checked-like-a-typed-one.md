---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-core': minor
---

A value set from code is now checked for validity the way a typed one is.
`ds-select`, `ds-searchable-select`, `ds-text-field`, `ds-text-area`,
`ds-range-input` and `ds-color-picker` only re-checked themselves from their own
event handlers, so a required field filled programmatically - restoring a draft,
prefilling a form - still reported `valueMissing`. The form refused to submit
and pointed at a field with an answer sitting in it.

`ds-core` exports `changedWhatValidityReads(changed)`, which each field asks
in `updated`. `ds-checkbox` already did this in `willUpdate` and is unchanged.
