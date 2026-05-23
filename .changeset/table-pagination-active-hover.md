---
"@jsekulowicz/ds-components": patch
---

- `ds-table-pagination` no longer flashes its active page button back to the muted surface colour on hover. The generic `button:hover:not(:disabled)` rule was outranking the `[aria-current="page"]` rule on specificity, so the navy/accent active state was overwritten with grey as soon as the pointer touched it. Added an explicit `button[aria-current="page"]:hover:not(:disabled)` step using the existing `--ds-color-accent-hover` token, so the active button stays on-brand throughout hover.
