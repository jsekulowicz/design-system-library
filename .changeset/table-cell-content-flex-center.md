---
"@jsekulowicz/ds-components": patch
---

`ds-table`: cells (`.cell-content`) now use `display: flex; align-items: center` instead of `display: block`, so custom slotted content (icon scales, badges, links) centres vertically against text cells. Horizontal alignment is preserved — `align="right"`/`"center"` columns map to `justify-content`, and `text-align` still governs wrapped text.
