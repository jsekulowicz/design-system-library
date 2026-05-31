---
"@jsekulowicz/ds-components": patch
---

Share the scroll-fade across `ds-dialog`, `ds-drawer` and `ds-table`. The
gradient is now defined once as `--ds-scroll-fade-mask` (tunable via
`--ds-scroll-fade-depth` and `--ds-scroll-fade-offset`), the identical card-body
scroll styles live in one place, and all three are driven by the same
`ScrollFadeController` — the table no longer uses a scroll-progress timeline, so
a short, non-scrolling table no longer shows a phantom fade either. The fade is
also deeper now (`--ds-space-8`) for a more obvious cue.
