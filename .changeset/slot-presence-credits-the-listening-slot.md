---
'@jsekulowicz/ds-components': patch
---

`SlotPresenceController` now records presence against the slot that listened
rather than the one the event came from. `slotchange` bubbles, so a slot
assigned into a tracked slot delivered its own name instead, leaving the
tracked slot's state stale and writing a name nothing was watching.

No component nested slots that way until now, so nothing on the shipped
components changes.
