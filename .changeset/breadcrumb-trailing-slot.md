---
'@jsekulowicz/ds-components': minor
---

`ds-breadcrumb` takes a `trailing` slot for controls that belong beside the
current crumb. They join the trail's own flex row, so they follow the last
crumb onto whichever line it wraps to instead of sitting against the block.
The wrapper is `role="none"`, keeping the control out of the list semantics.
