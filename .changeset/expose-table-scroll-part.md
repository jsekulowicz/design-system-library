---
"@jsekulowicz/ds-components": patch
---

- Expose the `<table>`'s outer scroll wrapper as `part(scroll)` on `ds-table`. Consumers can now delegate vertical scrolling to it (or re-target the scroller entirely) without having to break the table layout from outside. Useful for fixed-header + scrolling-tbody patterns where the host needs to be a flex column and the scroll wrapper needs to carry the remaining height.
