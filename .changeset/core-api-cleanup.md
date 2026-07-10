---
"@jsekulowicz/ds-core": minor
---

New `visuallyHiddenStyles` export; `DsElement` base styles now include a `.visually-hidden` class, so every component can hide screen-reader-only content without hand-rolling the pattern.

Breaking: removed unused exports `ThemeController`, `ContainerSizeController`, `prefersDarkScheme`, `prefersReducedMotion` and `ensureId` (and the `Theme`/`BreakpointName` types). None had consumers, docs or tests.
