---
'@jsekulowicz/ds-components': patch
---

`ds-menu` caps its item list at 328px instead of 320px. Eight items are 320px
tall on their own, so with the list's padding the old cap scrolled a full menu
by 8px, clipping the last item and hiding the bottom padding.
`--ds-menu-max-height` still overrides it.
