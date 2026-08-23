---
'@jsekulowicz/ds-components': patch
---

A searchable multi-select lays its trigger out the way it reads: selected tiles
first, then the search field filling what is left of the row. Once the tiles no
longer fit beside the field the rows invert, so the field keeps the first row -
level with the search icon and the caret - and the tiles stack underneath it
rather than pushing the field out of reach. The overflow counter always travels
with the field, immediately to its left.

The field no longer reserves a column of its own beside the tiles, which used to
leave a gap between them, and the tiles no longer stretch past their content.

`--ds-select-search-width` sets how much room the field asks for, and
`--ds-select-leading-size` the space reserved for a leading icon.
