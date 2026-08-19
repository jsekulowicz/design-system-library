---
'@jsekulowicz/ds-components': patch
---

Allow deferred custom elemenets registration. Set **DS_DEFER_CUSTOM_ELEMENTS** global variable before running flushCustomElementDefinitions() and before running main.ts file in order to filter and register only the required custom elements at the initial load.
