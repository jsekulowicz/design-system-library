---
'@jsekulowicz/ds-components': minor
---

Every field's label is now a `label` CSS part, so a consumer can size or place
it without redefining a type token on the host and hoping nothing else inside
reads that token. `ds-text-field`, `ds-text-area`, `ds-range-input`, `ds-select`,
`ds-searchable-select`, `ds-segmented-control` and `ds-color-picker` all render
the shared field label, so all seven gain it.

`ds-fieldset`, `ds-radio-group` and `ds-checkbox-group` name a group rather than
a single control, and their `<legend>` is styled by that same shared rule, so it
answers to `label` as well as the `legend` it has always answered to. One
selector now reaches the label of every field, whichever shape it is, which is
the point of having one.

What it unlocks: a label beside its control rather than above it. Laying the
host out as a row already puts the two on one line, but the label could not then
be told apart from the control's own text - `::part(label)` is what makes that
arrangement styleable, and the group keeps the accessible name its `label`
property gives it.

The char counter stays outside the part, as it stays outside the `<label>`: it
is not part of the field's name.

Nothing else moves, but a few long-standing parts get their first mention.
`ds-checkbox` and `ds-radio` word their labels differently - a slot rather than a
`label` property - and already exposed `label` beside `box` and `dot`, the group
fields already exposed `fieldset` and `legend`, and the text fields already
exposed `wrap`, `input` and the `field-header` row their character counter sits
in. Only the manifest never said so; it does now, so
every part a field offers is one a consumer can find.
