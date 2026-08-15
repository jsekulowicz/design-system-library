---
'@jsekulowicz/ds-components': patch
---

Fix `ds-table` losing its row hover and focus highlight on even-numbered cards in stacked mode. The rule added in 0.67.0 to stop zebra striping tinting whole cards outranked the interactive-state rules, so hovering the 2nd, 4th or 6th card gave no feedback while odd cards tinted normally - and on a table with a pinned column, only the pinned cell reacted. The striping reset now applies to resting rows only.
