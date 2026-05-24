---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog`'s body region no longer clips focus outlines (or any other decoration that extends a few pixels beyond a child's border box). The body needs `overflow-y: auto` for scroll, and `overflow-y` clipping applies to both axes by spec, so previously a focused `ds-select` or `ds-text-field` inside a dialog showed its top/bottom outline but had the left/right sides shaved off where they crossed the body's padding edge. Added `overflow-clip-margin: var(--ds-space-2)` so non-scrolling overflow (outlines, ring decorations, popover shadows) gets ~8px of breathing room beyond the clip box before being trimmed; scrolling content still clips at the same boundary it did before.
