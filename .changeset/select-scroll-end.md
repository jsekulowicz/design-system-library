---
'@jsekulowicz/ds-components': minor
---

ds-select and ds-searchable-select emit `ds-scroll-end` once each time their option listbox is scrolled near the bottom (re-armed after scrolling away or reopening). Hook for consumers that paginate options with infinite scroll.
