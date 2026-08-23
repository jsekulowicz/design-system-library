---
'@jsekulowicz/ds-components': patch
---

A multi-select trigger no longer grows a row when the search field opens. The
field used to claim a full row of its own once tiles existed, which changed the
trigger's height the moment a first tile was selected. It now shares the tile
rows, and the tiles simply outgrow it, so a tile that fits beside the leading
icon still stays there.
