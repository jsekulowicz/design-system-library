---
'@jsekulowicz/ds-components': patch
---

`ds-nav-item` and `ds-nav-group` switch their text color at once instead of fading it, so a nav item that swaps its icon for the current page changes icon and color in the same frame. The background still fades.
