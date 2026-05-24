---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog`'s body now actually lets focus outlines escape its inline padding edge. The previous fix added `overflow-clip-margin` but kept `overflow-y: auto`, and per spec `overflow-clip-margin` only applies when `overflow` is `clip` — so it was a no-op and a focused `ds-select` or `ds-text-field` still had its left/right outline shaved off. Switched to `overflow-x: clip; overflow-y: auto` with `overflow-clip-margin-inline`, which gives outlines ~8px of breathing room on the inline axis while preserving block-axis scrolling.
