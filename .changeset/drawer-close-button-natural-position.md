---
"@jsekulowicz/ds-components": patch
---

- `ds-drawer`'s close button now sits in its natural flex position inside the title row, vertically centred with the title. Removed the negative-margin offset that was carried over from `ds-dialog`; that offset was there to compensate for the dialog's 24px card padding pulling the X button away from the corner, but the drawer's title row owns its own padding (and is often 0-padded in the page-shell sidenav case), so the offset just produced a misaligned button.
