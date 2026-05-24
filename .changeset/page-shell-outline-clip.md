---
"@jsekulowicz/ds-components": patch
---

- `ds-page-shell`'s `aside` and `main` regions no longer clip focus outlines on the inline axis. The aside already used `overflow-x: clip; overflow-y: auto;` so a focused `ds-nav-item` near the inline edge had its left/right outline shaved off; added `overflow-clip-margin-inline: var(--ds-space-2)` to let outlines escape while preserving the vertical scroll. `main` was `overflow: auto` (both axes scroll), where `overflow-clip-margin` has no effect by spec — switched it to `overflow-x: clip; overflow-y: auto` so the inline axis stops being a scrollport and outlines get the same breathing room. Consumers who relied on horizontal page scrolling now need to enable it on their own wrapper.
