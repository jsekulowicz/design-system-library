---
'@jsekulowicz/ds-components': minor
---

ds-select and ds-tooltip now position their popovers with CSS anchor positioning instead of JS. The dropdown/bubble stays glued to its trigger on scroll without any script, matches the trigger width (select), flips to the opposite side when there's no room, and slides to stay within the viewport near a screen edge — fixing the off-screen overflow when a trigger sits near an edge. Requires a browser with CSS anchor positioning support (Chromium 125+, Safari 26+, recent Firefox).
