---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog`'s body now reliably lets focus rings on full-width children (`ds-select`, `ds-text-field`, etc.) escape its inline clip box, even in browsers where `overflow-clip-margin-inline` is silently ignored. Replaced the previous `overflow-clip-margin-inline` declaration — which the spec says applies to a single clipped axis, but which renders inconsistently across recent Chromium/Firefox/Safari builds — with a `padding-inline: var(--ds-space-2)` + matching negative `margin-inline` pair. The scrollport edge moves outward 8px past the original content edge so focused children's box-shadow rings paint inside it, while the negative margin keeps the visible content area exactly where it was. No reliance on a partially-supported CSS property.
