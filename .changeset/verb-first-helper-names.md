---
'@jsekulowicz/ds-core': minor
'@jsekulowicz/ds-components': minor
---

Rename the exported helpers so each name starts with what it does. The old names are gone:

- `@jsekulowicz/ds-core`: `nextId` is now `createId`, `changedWhatValidityReads` is now `hasValidityInputChanged`.
- `@jsekulowicz/ds-components/bar-chart`: `niceMax` is now `computeNiceMax`.
- `@jsekulowicz/ds-components/pie-chart`: `arcPath` is now `buildArcPath`, `labelPlacement` is now `computeLabelPlacement`, `polarPoint` is now `toCartesianPoint`, `innerRadiusFor` is now `computeInnerRadius` and `sliceTotal` is now `sumSliceValues`.
- `@jsekulowicz/ds-components/heatmap-calendar`: `civilFromDays` is now `toCivilFromDays`, `daysFromCivil` is now `toDaysFromCivil` and `levelForValue` is now `getLevelForValue`.
