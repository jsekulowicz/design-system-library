---
"@jsekulowicz/ds-components": patch
---

`ds-table` `scroll-body`: in the stacked (mobile) layout the header is hidden, so
the top fade is no longer offset by the header height — it now fades from the
very top like the dialog and drawer.

The scroll-driven fade keeps its original at-rest cues: the top edge fades once
you scroll down, and the bottom edge fades while there is more content below.
(Reverts the earlier experiment that hid the resting-edge fade.)
