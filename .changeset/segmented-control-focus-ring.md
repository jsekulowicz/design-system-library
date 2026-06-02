---
"@jsekulowicz/ds-components": patch
---

Fix the `ds-segmented-control` focus ring being clipped by the neighbouring
segment. The focused segment is now lifted above its siblings so the full ring
is visible on all sides, including against an adjacent selected (accent)
segment.
