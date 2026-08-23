---
'@jsekulowicz/ds-tokens': minor
'@jsekulowicz/ds-components': minor
---

Land text and centered content on whole pixels.

Nothing set a base line-height, so any element that did not reach for a token
fell through to CSS `normal` - 21.5px for the body font at 16px. On a 1x display
that put a majority of the page on half pixels, and everything centered below a
run of text inherited the offset. `:root` now carries
`line-height: var(--ds-line-height-normal)`.

The line-height tokens are emitted as `round(up, <multiplier>em, 2px)` instead of
bare multipliers, so every font-size pairs with every line-height to give a whole,
even line box. Previously `snug` was fractional at five of the ten font sizes, and
`tight` and `relaxed` were fractional at `body-md` and `heading-xs`. Because `em`
resolves at the element using the token, this also holds when a consumer overrides
a component's font-size through a part. Values are computed at computed-value time
and cost nothing at runtime. This raises no browser floor: the library already
requires CSS anchor positioning, which lands later than `round()` everywhere.

`ds-table` switches to `border-collapse: separate`. Collapsed 1px borders are
split across adjacent cells, which started every cell's content box on a half
pixel and pushed centered cell content off the grid.

`ds-popover-button`'s wrapper is `inline-flex` rather than `inline-block`, so its
trigger no longer sits in a baseline line box whose height moves with the
inherited line-height.
