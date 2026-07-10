---
"@jsekulowicz/ds-components": minor
---

Toast: `actions` now accepts a data-driven `ToastAction[]` (label + onClick + optional variant) in addition to the existing lit render function. Callers can add action buttons without hand-writing lit templates; the toast renders `ds-button`s and passes the controller to each `onClick`.
