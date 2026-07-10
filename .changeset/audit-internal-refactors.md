---
"@jsekulowicz/ds-components": patch
---

Code-quality audit pass, no public API changes:

- Invalid form controls now use the `--ds-shadow-focus-danger` token instead of a hardcoded light-theme colour, fixing their focus ring in dark theme.
- Duplicated CSS collapsed into shared modules (field-control chrome, alert/toast notice surface, menu-item/select-option rows, checkbox/radio toggles, group fieldsets, visually-hidden).
- Shadow-DOM markup cleanup: wrapper spans that were restyled to block/flex are plain divs now; internal class names changed (`sr-only` → `visually-hidden`, checkbox `box` / radio `dot` → `control`, alert/toast root → `notice`). All `part` names are unchanged.
- z-index values map to `--ds-z-index-*` tokens instead of magic numbers.
- bar-chart and page-shell split into smaller modules; behaviour identical.
