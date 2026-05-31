---
"@jsekulowicz/ds-components": patch
---

`ds-dialog`: inset body content by the scroll-fade depth (`--ds-space-6`) so it
sits in the opaque middle of the mask. The fade still reads as the usual cue
while scrolling (the viewport edges show content), but short non-scrolling
content stays clear of the fade — including on engines that park an inactive
scroll-progress timeline at an extreme keyframe when the body shrinks from
scrollable to non-scrollable (e.g. Chrome painting a top fade over a dialog
whose form was replaced by a short confirmation).
