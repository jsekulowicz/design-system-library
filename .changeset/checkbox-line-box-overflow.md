---
'@jsekulowicz/ds-components': patch
---

Fix `ds-checkbox` / `ds-radio` overflowing their own host box by ~2px. The label used `line-height: 1`, so the host box was shorter than the text it rendered and the host's baseline was synthesized from the (textless) control box: a `getBoundingClientRect().height` of 16 contributed 18px to the parent's `scrollHeight`. The label now uses `--ds-line-height-snug` and takes the host's baseline from the label text, so the control occupies a line exactly like a word does. As a side effect the control row is ~4px taller; the box and label are still centred on each other.

The most visible symptom was in `ds-dialog`: a checkbox as the last body element made the body count as scrollable, and the scroll fade painted a full `--ds-scroll-fade-depth` over the checkbox row, which then looked cut off. `ScrollFadeController` now also ignores up to 2px of overflow, rather than 1px, before treating a container as scrollable.
