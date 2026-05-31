---
"@jsekulowicz/ds-components": patch
---

`ds-dialog`, `ds-drawer`: the body scroll fade is now driven by a small
`ScrollFadeController` (a `scroll` listener + `ResizeObserver` + `MutationObserver`,
rAF-throttled) instead of a scroll-progress timeline. It sets
`--ds-scroll-fade-top` / `--ds-scroll-fade-bottom` from the real scroll position,
so the content mask fades the bottom edge while more is below, the top edge once
scrolled, and NOTHING when the content fits — fading content into the background
(theme-aware, works in light and dark) with no phantom fade on non-scrollable
content, including a dialog whose scrollable form is swapped for a short
confirmation. `ds-table` keeps its existing fade.
