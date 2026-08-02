---
'@jsekulowicz/ds-components': patch
---

`ds-select` and `ds-searchable-select`: show the listbox before restoring its
scroll position.

Opening a select with a selection already made left a blank block above the
first option, sized `max(0, index - 5) * 36px`. The listbox is `popover="manual"`
and therefore `display: none` until it is shown, so it has no scroll box — the
seeded `scrollTop` was silently discarded and the virtual list's top spacer was
left standing. Any later render (hovering an option, arrowing, scrolling)
re-synced it, which is why the gap seemed to fix itself.

`required` on `ds-select` now actually validates, for `multiple` too. It
previously rendered the `*` and set validity only when picking an option in a
single select, so an untouched required select reported valid and a required
multi-select never reported anything — `checkValidity()` and `ds-form` waved
both through. Error styling still waits for the first interaction or an explicit
`showValidity()`.

Note for consumers already shipping a required `ds-select`: a genuinely empty
one now blocks `ds-form` submission where it previously did not.
