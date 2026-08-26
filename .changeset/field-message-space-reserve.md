---
'@jsekulowicz/ds-components': minor
---

Make `message-space` actually reserve its row on form fields. The subtext row floored itself with `calc(font-size * line-height)`, but the line-height tokens resolve to lengths rather than ratios, so the multiplication was invalid and the declaration was dropped. The empty spacer has no text to give it a line box, so it measured 0 and a field with `message-space` still jumped by one line the moment its error appeared - the shift the opt-in exists to prevent.

The spacer now carries the same type as the description and error rows it stands in for, and all three reserve one line box.

Fields that set `message-space` grow by one body-sm line (12px at the default scale) when they have no message. That is the reserve working; fields without the attribute are unchanged.
