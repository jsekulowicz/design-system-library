---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-tokens': minor
'@jsekulowicz/ds-react': minor
---

Add `ds-share-bar`, a single stacked bar showing how one total splits across categories with a legend. Flex sizes the bar from the raw values, so a tiny share held at `--ds-share-bar-segment-min-width` steals space proportionally instead of overflowing the track. Categories keep the caller's order, and `max-segments` collapses an open-ended tail into one muted `Other` share rather than reusing a color already on the bar.

Add `--ds-color-chart-7` and `--ds-color-chart-8`, and reorder the default chart ramp so adjacent series never share a hue family. `ds-pie-chart` and `ds-bar-chart` keep the same set of colors but assign them in a different order.

Fix `ds-table` stacked mode, where several rules written for the flat table still applied: label/value rows now share a 40px minimum height, dividers appear inside every card (including the last), values line up regardless of the column's alignment, zebra striping no longer tints whole cards, and the pinned-column edge border no longer paints a second border down the first cell of each card.

Fix slot presence detection for text-only content. A slot filled with a bare text node read as empty whenever the host was moved in the light DOM, which is how `ds-progress-bar` lost its label when a consumer re-rendered the wrappers around it.
