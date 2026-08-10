---
'@jsekulowicz/ds-components': minor
---

Tighten the reserved field-message row, and give `ds-checkbox` one.

**Message row.** The row reserved under every field was 18px, which reads as a large gap. It now sizes off `--ds-line-height-none`, so 12px. The `line-height` on the message text moved with it: `min-block-size` is a floor, so leaving the text at `normal` would have kept the row at 18px regardless. The error icon changes from `1rem` to `1em` for the same reason — a 16px icon in the flex row sets the row height on its own.

**`ds-checkbox` messages.** It had no message support at all: `invalid` only recoloured the box, so consumers hand-rolled an error element underneath with their own font size and colour. It now accepts `description` and `error` and renders the same subtext as every other field.

Reserving the row is opt-in on a checkbox, via the new `message-space` attribute. A checkbox inside a `ds-checkbox-group` is slotted, so reserving by default would add a blank row per option — underneath a group that already renders its own message.

**`ds-checkbox-group` / `ds-radio-group` / `ds-fieldset`.** The reserved spacer was missing the `margin-top` that `.description` and `.error` get, so those groups still shifted by 4px when a message appeared.

**`ds-color-picker`.** The compact trigger and the swatch check colour read `getComputedStyle` to pick a contrasting foreground. Lit flushes asynchronously, so those runs can land after the view is gone — a torn-down test environment, or SSR — where the global does not exist. Both feature-detect it now; the rendered result is unchanged wherever a view exists.
