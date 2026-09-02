---
'@jsekulowicz/ds-components': patch
---

`announce-on-connect` works as an attribute on `ds-alert`. Lit derives the
default attribute name by lowercasing, so the property answered to
`announceonconnect` and the documented kebab-case form set nothing - an alert
asking to be announced on mount was rendered silently instead.
