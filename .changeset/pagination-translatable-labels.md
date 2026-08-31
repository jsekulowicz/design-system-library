---
'@jsekulowicz/ds-components': minor
---

Let `ds-table-pagination` be translated. Its summary and prev/next button text were already slottable, but the strings a screen reader depends on were not: the `<nav>` landmark, both button accessible names, each page button's "Page N", and the page-size select were English literals with no way past them, as was the "Page N of M" text `hide-page-numbers` renders. A Spanish page read as Spanish and announced as English.

Every user-facing string is now a property, defaulting to what the component rendered before: `label`, `prev-page-label`, `next-page-label`, `page-label`, `page-of-label`, `rows-per-page-label`, `summary-label` and `empty-label`. The three that need values interpolate `{page}`, `{total}`, `{start}` and `{end}`; an unrecognised placeholder is left alone rather than printed as `undefined`.

`summary-label` is worth preferring over the `summary` slot: the component already clamps `page` to the last real page, and a consumer that rebuilds the sentence itself has to repeat that clamping or print a range that does not exist.

Nothing changes for consumers who set none of them.
