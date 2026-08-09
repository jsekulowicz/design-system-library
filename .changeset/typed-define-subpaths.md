---
'@jsekulowicz/ds-components': patch
---

Add `types` to the 43 subpath exports that only declared `import`, so
`@jsekulowicz/ds-components/button/define` and friends resolve to their type
declarations instead of nothing. The `.d.ts` files were always emitted; the export map just
never pointed at them.
