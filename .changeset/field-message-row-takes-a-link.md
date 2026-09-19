---
'@jsekulowicz/ds-components': minor
---

A field's message row can hold a link. Every form field now renders its
description, warning and error text through a slot of that name, so a consumer
can pass markup - `<span slot="warning">Awaiting <ds-link>review</ds-link></span>` -
and keep the icon, color and reserved row the attribute would have given them.
The attribute still decides which row shows, and its text remains the fallback.

The warning and error icon now sits on the first line of a message that wraps,
rather than centered on the whole block.
