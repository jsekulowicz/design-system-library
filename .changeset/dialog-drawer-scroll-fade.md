---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog` and `ds-drawer` bodies hide the native scrollbar and signal overflow with a soft top / bottom fade-mask instead. Before, the native vertical scrollbar floated mid-way inside the card's right padding (a side-effect of the focus-ring escape padding-margin trick), which looked uncanny. The bar is now hidden via `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, and a `mask-image` linear-gradient fades the top and bottom edges of the body. A matching `padding-block: var(--ds-space-3)` keeps content out of the fade zone at rest so edges stay sharp when nothing overflows; when content scrolls past that buffer it visibly fades into transparency, indicating more content above or below. Aligns with Linear, Notion and most modern modal surfaces.
