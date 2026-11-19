---
'@jsekulowicz/ds-components': patch
---

`ds-carousel` contains sideways overscroll only while its row overflows. When every item fits, a sideways swipe over the carousel reaches the browser back and forward gestures again. Browsers without scroll-linked animations keep the old behavior and always contain it.
