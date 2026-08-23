---
'@jsekulowicz/ds-components': patch
---

Render crisply on 1x displays.

`ds-table` header cells now use an integer line-height, so the header is exactly
the `--ds-table-header-height` it already declares (41px, was 46.5px) and the
body below it starts on a whole pixel instead of a half one. This also corrects
the scroll-fade offset in scroll-body mode, which was derived from that token.

`ds-icon` drops 24/outline strokes from 1.5 to 1 at `2xl` below 1.5dppx, where a
1.5 stroke straddles three pixels instead of filling one. Higher densities are
unchanged.

`ds-top-bar`'s height now carries the 1px rule on top of its 48px band rather
than inside it. The band was 47px, so anything centred in it -- the brand, and
every action button and its icon -- sat on a half pixel. The bar is 1px taller
as a result.

`ds-select`'s listbox hint and `ds-stat-tile`'s value swap to line-heights that
resolve to whole pixels at their font sizes (16.5px to 18px, 38.5px to 35px).
