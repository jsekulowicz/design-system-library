---
'@jsekulowicz/ds-components': minor
---

Add `ds-range-input`: an accessible slider atom for picking a numeric value within a min/max range. Built on a native `<input type="range">` with form participation via ElementInternals, it supports `min`/`max`/`step`, `sm`/`md`/`lg` sizes, an optional `show-value` output, label/description/error, and consumer-controlled `invalid` state. Emits `ds-input` (while dragging) and `ds-change` (on commit) with a numeric `value` detail. When `disabled`, the control stays focusable and exposes `aria-disabled="true"` so assistive tech can find and announce it, while keyboard and pointer interaction are blocked.
