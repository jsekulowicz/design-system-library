---
"@jsekulowicz/ds-components": patch
---

- `ds-dialog`'s body now reliably scrolls when content exceeds the dialog's max-height, including on short mobile viewports. The native `<dialog>` element was given `max-height: min(90vh, 720px)` and `overflow: visible` but no explicit `height`, and the inner `ds-card` used `height: 100%` to fill — but `height: 100%` only resolves against a parent with an *explicit* height, not just `max-height`, so it computed to `auto`, `ds-card` sized to its content, and the body's `flex: 1 + overflow-y: auto` never got a height to scroll against. Overflowing content painted visibly past the dialog edge instead, most noticeably on mobile where `90vh` actually bit. Switched `<dialog>` to `display: flex; flex-direction: column` and `ds-card` to `flex: 1; min-height: 0` so the height cap propagates and the body scrolls.
