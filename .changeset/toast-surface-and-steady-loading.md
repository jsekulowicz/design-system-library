---
'@jsekulowicz/ds-components': patch
---

A toast now reads as its own surface. It filled with `--ds-color-bg`, the same
value the page background uses, so in both themes it had no fill to speak of -
only a shadow separated it from whatever it floated over, and where the shadow
was faint or the corners squared off, nothing did. It now fills with
`--ds-color-bg-subtle`, one step up from the page. `--ds-toast-bg` overrides it
for a consumer that wants a surface of its own.

Loading no longer moves anything. A searchable select's spinner carried a
`margin-left` the caret it replaces does not, so every load widened the trigger
by one space step - enough to shift a content-sized column of them all at once
while options were fetched. The trigger already spaces its own children, so the
margin is gone and the spinner occupies exactly the caret's box.

A button with `loading-label` holds its label still for the same reason. Its
spinner was drawn at 1.25rem while `ds-icon` defaults to 1.125rem, so a button
whose loading label matched its idle label - the two sharing one grid cell -
still grew and slid its text sideways on every state change. The in-flow spinner
now takes the icon's default size. Override `--ds-spinner-size` when the leading
icon is a different one.
