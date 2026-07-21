---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-core': minor
---

Stable `ds-button` loading width and a spinner that actually spins.

- `ds-button` gains `loading-label`: while `loading`, it replaces the slotted label and pins the
  button to the wider of the two labels, so toggling `loading` no longer reflows neighbouring
  controls.
- Without `loading-label`, the leading slot now shares a grid cell with the spinner instead of
  being swapped out, so entering the loading state can never shrink the button.
- Fixed the spinner arc: `stroke-dasharray` equalled the circle's circumference, so it drew a
  closed ring and rotating it was a visual no-op. Extracted to a shared module reused by
  `ds-button`, `ds-nav-item` and `ds-searchable-select`, all of which had the same bug.
- `reducedMotionStyles` now exempts elements marked `.ds-allow-motion`. Spinners are essential
  status feedback, so they keep animating under `prefers-reduced-motion` at roughly half speed
  instead of being frozen by the global clamp.
