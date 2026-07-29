---
'@jsekulowicz/ds-core': patch
'@jsekulowicz/ds-components': patch
---

Stop form controls turning red before the user has touched them. `ds-text-field`, `ds-text-area` and `ds-color-picker` synced their `invalid` flag from native validity in `firstUpdated`, so a `required` field with an empty value was styled as an error from the moment it rendered — a sign-up form opened with every input outlined in danger.

`FormControlMixin` now tracks interaction: `markInteracted()` records that the user has typed in, committed or left the control, and `resolveInvalid(current, fromValidity)` returns what `invalid` should become, or `null` to leave it alone. The form still receives the true validity via `setValidity` from the first render, so submit-time validation and `:invalid` form matching are unchanged — only the visual flag waits.

The same change fixes a second problem: `resolveInvalid` returns `null` once a consumer has assigned `invalid` itself, so an app-supplied error (a duplicate name, a rejected credential — anything the browser cannot know about) is no longer wiped out by the next keystroke or blur. Consumers that worked around this by re-asserting `invalid` on `ds-change` can drop the workaround.

Text fields and text areas now also validate on blur, so tabbing out of a required field you left empty flags it. And `ds-form` calls the new `showValidity()` on its controls when a submit is rejected — the field that blocked it is exactly the one nobody visited, so it must not stay unstyled.
