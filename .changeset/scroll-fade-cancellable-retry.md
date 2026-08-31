---
'@jsekulowicz/ds-components': patch
---

Stop `ScrollFadeController` leaving work behind when its host goes away. The controller retries attaching to a scroller that has not rendered yet, up to ten animation frames, but the retry handle was never stored, so `#detach` could not cancel it: a dialog opened and closed quickly left the rest of the chain running against a host that was gone.

The retry is tracked and cancelled now, and the frame loop is reached through the same `typeof` guard the controller already uses for `ResizeObserver` and `MutationObserver`, so a host that updates in an environment without one no longer throws.
