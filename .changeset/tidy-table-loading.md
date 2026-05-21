---
"@jsekulowicz/ds-components": patch
---

- Render the internal `<caption>` element only when `slot="caption"` content is provided.
- Add `responsive="stack" | "scroll"` to `ds-table`, defaulting to stacked rows in narrow containers.
- Make the table skeleton use compact stacked cards in narrow containers when responsive stacking is enabled.
