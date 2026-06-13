---
'@jsekulowicz/ds-components': minor
---

ds-select and ds-searchable-select dropdown options now wrap long primary text onto multiple lines instead of truncating it with an ellipsis, so long labels (e.g. full clue sentences) can be read in full. The option keeps its single-line height as a baseline and grows only when the text wraps; the closed trigger still truncates.
