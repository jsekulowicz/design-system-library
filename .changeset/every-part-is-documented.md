---
'@jsekulowicz/ds-components': minor
---

`ds-nav-group` exposes its heading label as a `label` part, the way `ds-nav-item`
already does, and its chevron as the `chevron` part the manifest has always
listed - that one was documented but never actually rendered, so a consumer
styling `::part(chevron)` was styling nothing.

The rest is documentation catching up with what the components already render.
Thirteen of them exposed parts the manifest never mentioned, so anyone reading
the API had no way to learn they were there: `ds-link`, `ds-badge`,
`ds-divider`, `ds-alert`, `ds-form`, `ds-list`, `ds-list-item`, `ds-toast`,
`ds-settings-page`, `ds-page-shell` and `ds-nav-group` itself, plus the
`loading` overlay on `ds-bar-chart` and `ds-pie-chart` that `ds-table` was
alone in documenting. Nothing about their rendering changes.

Two names went the other way. `ds-range-input` listed a `track` part, but the
track is the native slider's own pseudo-element and never was a separate element
to select; `--ds-range-track-height` and `--ds-range-thumb-size` are documented
in its place. `ds-color-picker` listed a `swatch` part that lives three shadow
roots down in `ds-color-picker-swatch`, which `::part()` does not reach. Neither
selector ever matched anything, so nothing that worked before stops working.

Every part the library renders is now documented, and every part it documents is
now rendered.
