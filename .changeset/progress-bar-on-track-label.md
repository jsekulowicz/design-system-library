---
'@jsekulowicz/ds-tokens': minor
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-react': minor
---

Rebuild `ds-progress-bar` around a label on the track. The label sits on the bar, centered by default (`label-align="start|center|end"`), in `--ds-font-size-body-lg` with tabular digits, next to a new `leading` slot for an icon. The track is dark with a light label in both themes, and the fill takes the hue of `--ds-progress-color` at a fixed lightness, so any color stays legible; the dark theme adds an outline around the whole bar. New tokens `--ds-color-progress-track`, `--ds-color-progress-label` and `--ds-color-progress-outline`. Breaking: the `bar` part and `--ds-progress-track-height` are gone, `--ds-progress-height` is now the track's minimum height, and the host no longer forces `width: 100%` - set `width: fit-content` to size the bar to its label.
