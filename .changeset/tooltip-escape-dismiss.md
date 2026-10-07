---
'@jsekulowicz/ds-components': patch
---

`ds-tooltip` now hides on Escape when it is showing because of hover or focus, and stays hidden until the pointer or focus next enters the trigger (WCAG 1.4.13). A tooltip held up by the `open` property is unaffected.
