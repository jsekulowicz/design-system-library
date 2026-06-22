---
'@jsekulowicz/ds-components': minor
---

Add `input-label` to `ds-select`, mirroring `ds-text-field`. It sets the trigger's accessible name without rendering a visible stacked label, so a select can carry a compact inline label (e.g. alongside its own text) instead of the stacked one. The no-label accessibility warning now accepts either `label` or `input-label`.
