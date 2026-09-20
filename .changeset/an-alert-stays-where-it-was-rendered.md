---
'@jsekulowicz/ds-components': minor
---

`ds-alert` no longer removes itself from the DOM when it is dismissed. It sets
a reflected `dismissed` attribute and hides where it stands, so the tree that
rendered it still owns every node it put there.

Pulling itself out was corrupting frameworks that track their own nodes: Vue
kept rendering against an element whose parent was gone, and what rendered
next - a route change, anything after the alert - landed in the wrong place or
nowhere at all. A consumer that renders the alert conditionally can still drop
it on `ds-dismiss`; one that reuses the element clears `dismissed` to show it
again.
