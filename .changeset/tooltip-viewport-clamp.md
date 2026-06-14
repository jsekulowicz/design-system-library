---
'@jsekulowicz/ds-components': patch
---

ds-tooltip with `top`/`bottom` placement now keeps its bubble within the viewport instead of letting a trigger near a screen edge push it off-screen (it clamps the horizontal position, leaving a small margin). Other placements are unchanged.
