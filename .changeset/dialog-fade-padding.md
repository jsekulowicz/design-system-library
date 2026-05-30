---
"@jsekulowicz/ds-components": patch
---

`ds-dialog`: keep body content clear of the scroll-fade at rest. A
scroll-progress timeline on a non-scrollable body parks at an extreme keyframe
on some engines (e.g. Chrome parks at 100%, painting a top fade) rather than
deactivating, which dimmed short, non-scrolling dialog content. The body now
insets its content by `--ds-space-3` and the fade band is trimmed to the same
depth, so content sits outside the fade band on any engine — no scroll-state JS.
