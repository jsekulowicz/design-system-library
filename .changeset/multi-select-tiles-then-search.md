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

The field also keeps the height of a tile row, so its text sits level with the
search icon and the caret whether or not an overflow counter shares the row, and
it keeps its placeholder once something is selected - reading as a prompt to
search rather than the idle prompt to choose. It reserves that room regardless,
so hiding the text only made the row look empty and left mouse users guessing
where to click.

`--ds-select-search-width` sets how much room the field asks for, and
`--ds-select-leading-size` the space reserved for a leading icon.
