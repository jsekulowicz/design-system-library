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
`.point-tooltip`. Their width is tunable through `--ds-point-tooltip-min-width`
and `--ds-point-tooltip-max-width`; bar and heatmap previously disagreed on a
minimum (120px against 8rem) for no reason, and both now take the shared
default. The heatmap tooltip's count and date sit on their own lines
again, which the shared bubble had collapsed onto one.

A multi-select trigger pins its caret and any leading icon to the first row
rather than letting them drift: the caret used to wrap below the tiles once they
filled a row, and the icon centered itself against the whole stack of tiles.
Selected tiles now share that first row and wrap one at a time instead of moving
as a block, and the search field no longer reserves a column beside them - it
collapses while the field is closed and takes a row of its own once opened, so a
tile that fits on the first row stays there. A multi-select that already has
tiles shows no placeholder at all; it only ever appeared clipped to whatever
width the tiles left over.

The `.ds-text-xl`, `.ds-text-2xl` and `.ds-text-3xl` utilities and the card,
dialog and form titles now declare their own leading. At those sizes the
inherited body line-height was shorter than the font.
