---
'@jsekulowicz/ds-components': minor
---

Tooltips take the page's own colors instead of inverting them. `ds-tooltip` and
the chart point tooltip now paint on `--ds-color-bg` with `--ds-color-fg` text,
a hairline border and a shadow to lift them off what they cover. An inverted
chip suits a two-word hint; these carry a title and a paragraph, and a dark
panel in a light page read as a different surface from the one it explains -
next to a consumer's own themed tooltip it read as a bug.
