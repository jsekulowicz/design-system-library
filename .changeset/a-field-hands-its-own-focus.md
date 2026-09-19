---
'@jsekulowicz/ds-components': minor
---

No form field delegates focus into its shadow root any more. A click on a
field's message row stays there, so its text can be selected and a link in it
clicked, instead of being handed to the control above it - which, on a select,
opened the dropdown.

Every path focus used to travel is now taken deliberately, and some of them
reach further than they did:

- `focus()` on the element forwards to the control, as before.
- The control is the anchor a select reports invalid, so a native form submit
  focuses it. The other fields already anchored theirs.
- A click inside the box a field draws - its padding, an adornment, the chevron
  of a select - focuses the control, so what follows is typed into it.
- Pressing a dropdown option keeps focus on the select until its click selects
  the value, so losing focus cannot dismiss the list before selection.
- A click on the label focuses the control, and opens what opens: a select's
  dropdown, a color picker's panel - the way a native `<select>`'s label opens
  its picker. `ds-select` and `ds-color-picker` name a trigger no `for` can
  label, so their labels reached nothing before.
