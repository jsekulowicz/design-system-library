---
"@jsekulowicz/ds-components": patch
---

- `ds-radio` and `ds-checkbox` now render crisply and stay centred on 1x / scaled external monitors. The controls used a `1.5px` border and fractional `rem` dimensions, which don't land on the device-pixel grid at 100% zoom: the browser splits the half-pixel border unevenly (shifting the dot off-centre) and offsets the checkbox tick by a fractional amount (blurring its diagonal edge). Both controls now use a `2px` border and integer-resolving sizes (`1rem` box, `0.5rem` radio dot, `1rem` tick) so every offset is a whole pixel.
- Indicators (`ds-radio`'s dot and `ds-checkbox`'s tick) keep their size next to wide labels (`flex-shrink: 0`).
- The control label uses `line-height: 1` so the 16px box defines the row height and lands on a whole pixel. Previously the box was vertically centred against the inherited (fractional) text line box, nudging it onto a half-pixel — invisible for the round radio dot but enough to smear the checkbox tick's diagonal edge on a 1x display.
