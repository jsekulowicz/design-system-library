---
'@jsekulowicz/ds-components': patch
---

Selected tiles in a multiple ds-select (and ds-searchable-select) now grow to the full row width before ellipsizing, instead of being hard-capped to a narrow fixed width that wrapped early and wasted the rest of the row. Long labels still truncate with an ellipsis, preserved whether the dropdown is open or closed.
