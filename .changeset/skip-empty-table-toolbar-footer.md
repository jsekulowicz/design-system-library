---
"@jsekulowicz/ds-components": patch
---

- `ds-table` no longer renders its `toolbar` and `footer` wrapper divs when nothing is slotted into them. Previously both wrappers were always in the DOM (just hidden via `:empty { display: none }`), which gave them part(toolbar) / part(footer) presence even when unused and could interfere with consumer CSS that targets those parts. The component now mirrors the existing `caption` slot pattern: a MutationObserver tracks whether any element with `slot="toolbar"` or `slot="footer"` is present and skips rendering the wrapper otherwise.
