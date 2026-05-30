---
"@jsekulowicz/ds-components": patch
---

`ds-dialog`, `ds-drawer`, `ds-table`: the scroll-driven fade no longer shows a
phantom fade on content that isn't scrollable. The resting keyframe now paints
no fade, so a panel that fits its content stays clean even on engines that clamp
an inactive scroll-progress timeline to its 0% keyframe instead of deactivating
it. Trade-off: a scrollable surface no longer shows the bottom fade at its exact
resting top (it appears as soon as you scroll).

`ds-table` `scroll-body`: in the stacked (mobile) layout the header is hidden, so
the top fade is no longer offset by the header height — it now fades from the
very top like the dialog and drawer.
