---
'@jsekulowicz/ds-core': patch
'@jsekulowicz/ds-components': patch
'@jsekulowicz/ds-react': patch
'@jsekulowicz/ds-tokens': patch
---

Stop shipping stale build output, and drop two export paths that no longer resolve.

`@jsekulowicz/ds-core` declared `./theme-controller` and `./responsive` in its export map, but
neither source file exists any more — importing either would fail on any clean build. Both entries
are removed.

No package cleaned `dist/` before `tsc`, so the published tarballs carried artefacts from deleted
modules: 23 files in `ds-components` (including the removed `molecules/field` and
`organisms/navbar` components) and 2 in `ds-core`. Every package build now cleans first.

`ds-react` no longer declares a `lit` dependency it never imported.
