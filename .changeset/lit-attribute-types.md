---
'@jsekulowicz/ds-core': minor
'@jsekulowicz/ds-components': minor
---

Type the attributes that components forward to inner elements, so lit template analyzers stop
reporting `no-incompatible-type-binding` in editors.

`@jsekulowicz/ds-core` now exports `AriaRole`, `AriaBoolean`, `AriaChecked`, `AriaInvalid`,
`AriaHasPopup`, `LinkTarget` and `AutocompleteToken`. `ds-button`'s `role`/`aria-*` properties,
`ds-breadcrumb-item`'s `target`/`referrerpolicy`, and the `autocomplete` property on `ds-text-field`
and `ds-text-area` use them instead of `string`.

TypeScript consumers passing arbitrary strings to these properties will now see a type error; the
runtime behaviour of the underlying attributes is unchanged.

Optional attribute bindings moved from `?? nothing` to the `ifDefined` directive throughout. Same
rendered output — the attribute is still omitted when the value is absent.
