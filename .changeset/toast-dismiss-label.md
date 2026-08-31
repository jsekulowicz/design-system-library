---
'@jsekulowicz/ds-components': minor
---

Let the imperative `toast()` name its dismiss button. `ds-toast` gained a `dismiss-label` property, but a toast raised through `toast()` is created by the library rather than written in a template, so there was no way to reach it: every toast in a translated app still announced "Dismiss".

`dismissLabel` joins the other `ToastOptions` and is forwarded to the element it creates. Omitting it leaves the element's own default.
