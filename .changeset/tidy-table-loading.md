---
"@jsekulowicz/ds-components": patch
---

- Treat `ds-table` `loading` as a boolean property without reflecting it to a string attribute.
- Parse `loading="false"` and `loading="0"` as false for string-based integrations.
- Prioritize the skeleton state when `loading` is true and no rows are present; keep the loading overlay for refreshes with existing rows.
