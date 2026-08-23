---
'@jsekulowicz/ds-components': minor
---

Fix three layout problems the base line-height exposed, and one it did not.

`ds-pie-chart`'s donut center no longer leaves a text line box taller than the
text it holds: the value gets `none` leading and the label `tight`. The value
also stops breaking mid-number - `overflow-wrap: anywhere` split `$315,900`
across two lines - and instead scales down to the width of the donut hole,
capped at `heading-sm`, so nothing changes at normal chart sizes and small
charts shrink the number rather than mangling it. Tune the assumed widest value
with `--ds-pie-center-value-widest-em`.

`ds-pie-chart`, `ds-bar-chart` and `ds-heatmap-calendar` share one point-anchored
tooltip. Each had rolled its own bubble styling and its own placement maths -
percentage offsets, a measured above/below/contained switch, a scroll-compensated
`clamp()` - and each could be clipped by the screen edge on a narrow viewport.
The shared one renders in the Popover API top layer, so no ancestor overflow or
transform can trap it, and CSS anchor positioning flips or realigns it away from
the edge. `bar-chart-tooltip-position.ts` and the heatmap's scroll-offset state
are gone with it; the heatmap no longer re-renders on every scroll frame.

Chart tooltips now carry `data-open` rather than `hidden`, and their element is
`.point-tooltip`.

A multi-select trigger keeps its caret on the first row, centered against the
leading icon, instead of letting it wrap below the selected tiles once they
fill the row. The tiles reserve room for it rather than running underneath, and
the first row keeps the height of a tile so the caret lines up whether or not
the tiles share that row. A multi-select that already has tiles no longer shows
a placeholder at all - it only ever appeared clipped to whatever width the
tiles left over.

The `.ds-text-xl`, `.ds-text-2xl` and `.ds-text-3xl` utilities and the card,
dialog and form titles now declare their own leading. At those sizes the
inherited body line-height was shorter than the font.
