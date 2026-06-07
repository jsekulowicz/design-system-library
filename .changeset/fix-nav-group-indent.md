---
"@jsekulowicz/ds-components": patch
---

Fix `ds-nav-item` children of a `ds-nav-group` losing their start indentation in
expanded (non-compact) sidenavs. The `:not([compact])` guard was placed as a bare
compound selector alongside `:host(...)`, so it never matched the featureless shadow
host and the indentation rule was dropped entirely. Moving the guard inside `:host()`
(`:host([role='listitem']:not([compact]))`) restores the indent in expanded mode while
keeping compact items centered.
