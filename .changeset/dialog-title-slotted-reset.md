---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog` normalises any element slotted into the `title` slot. Previously a consumer who wrote `<h2 slot="title">Foo</h2>` (a perfectly reasonable semantic choice) got the inner heading's UA defaults applied on top of the dialog's own `.title-text` styling — a `font-size: 1.5em` compound that made the title visibly larger than `--ds-font-size-xl`, plus large UA `margin-block` that pushed the dialog body down. Added a scoped `.title-text ::slotted(*) { font: inherit; margin: 0; letter-spacing: inherit; }` so plain text, spans, and h1-h6 all render at the dialog's intended size with no extra spacing.
