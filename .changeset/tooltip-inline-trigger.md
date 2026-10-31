---
'@jsekulowicz/ds-components': minor
---

`ds-tooltip` takes an `inline` attribute that lets a text trigger wrap with the sentence around it, in that sentence's font and color. The tooltip no longer renders whitespace around its trigger, so a comma or period right after an inline tooltip sits flush instead of after a stray space. The `anchor` and `tooltip` parts are now `span` elements; both keep the display they had.
