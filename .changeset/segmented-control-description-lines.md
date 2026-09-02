---
'@jsekulowicz/ds-components': minor
---

Add `description-lines` to `ds-segmented-control`.

A description that changes with the selected option changes height with it,
and everything below the control moves. `description-lines` holds room for a
fixed number of subtext rows so the layout stays put - for whichever message
occupies the row, description or otherwise.

It takes a count rather than measuring: the control only ever sees one
description at a time and cannot know the longest of the set, so only the
consumer can say. Opt-in, for the same reason `message-space` is - 0.61.0
reserved those rows for everybody and 0.63.0 took it back out.
