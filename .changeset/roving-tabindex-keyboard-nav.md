---
"@jsekulowicz/ds-components": minor
---

Add proper radiogroup keyboard navigation (roving tabindex) to
`ds-segmented-control` and `ds-radio-group`. Each control is now a single
`Tab` stop that lands on the selected option; `←/→/↑/↓` and `Home/End` move
between options with selection following focus, wrapping at the ends and
skipping disabled options. This matches the WAI-ARIA radiogroup pattern (and
makes `ds-radio-group` behave as its docs already described).

Supporting changes: `ds-button` can now forward `tabindex` to its inner
button (alongside the existing `role`/`aria-checked` forwarding) and exposes a
`focus()` that delegates to it; `ds-radio` gains a `tab-stop` property and a
delegating `focus()`. A shared `resolveRovingTarget` helper holds the
navigation math.

`ds-checkbox-group` is intentionally left unchanged — independent checkboxes
should each remain in the tab order per the APG, rather than adopting roving
tabindex.
