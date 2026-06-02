---
"@jsekulowicz/ds-components": minor
---

`ds-segmented-control` now renders a visible field `label` and an optional
`description`, matching the layout of other form fields (`ds-select`,
`ds-text-field`). Segments are built from small `ds-button`s instead of
bespoke native buttons, so they inherit the design system's button styling,
sizing and focus states, and stretch to share the track evenly.

`ds-button` gains `role` / `aria-checked` forwarding (bound as properties) so
it can act as a radio within the segmented control's `radiogroup` — the role
and checked state land on the focusable element, never duplicated onto the
host.
