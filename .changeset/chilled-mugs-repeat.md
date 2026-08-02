---
'@jsekulowicz/ds-components': minor
---

Stop the loading state from resizing `ds-button`, close nested modals with their container, and add `ds-fieldset`.

- `ds-button`: the spinner no longer joins the flex row. Without a `loading-label` it renders as an overlay centred on the button while the content keeps its box and only loses visibility, so toggling `loading` cannot change the button's width or height. With a `loading-label` both states share one grid cell, including the spinner, so the resting width already covers the wider of the two.
- `ds-dialog` / `ds-drawer`: closing (or disconnecting) now closes any open `<dialog>` in the slotted content first. A nested modal used to survive its container being hidden and keep the whole document inert — a frozen page with no way back but a reload.
- New `ds-fieldset`: groups related controls under one legend with the same label typography as every other field. Horizontal wrapping row by default, `orientation="vertical"` and `borderless` variants, `--ds-fieldset-gap`.
- `SelectSize` is now exported from `@jsekulowicz/ds-components/select` and the package root, alongside `SelectOption`. It was the one size type consumers had to reach into `dist/` for.
