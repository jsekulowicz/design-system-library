---
'@jsekulowicz/ds-components': minor
---

`ds-select` and `ds-searchable-select` no longer virtualize their options: every option renders at its own height, so a long option wraps onto as many lines as it needs, however many options the list holds or later fetches. The arrow keys and reopening the list bring the focused option fully into view from its rendered position, below the dropdown `hint` when there is one. A list meant to hold thousands of options belongs behind search or `ds-scroll-end` pagination.
