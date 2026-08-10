---
'@jsekulowicz/ds-tokens': minor
'@jsekulowicz/ds-core': minor
'@jsekulowicz/ds-components': minor
---

Rebuild the line-height scale, validate fields on blur, and reserve a line for the field message.

**Line heights.** The `--ds-line-height-*` tokens existed but almost nothing used them: thirteen rules across the components hardcoded five different values, and the scale had no entry for the `line-height: 1` that single-line controls need. The scale is now `none` 1, `tight` 1.25, `snug` 1.375, `normal` 1.5, `relaxed` 1.75, and every component style consumes it. `.ds-leading-none` and `.ds-leading-snug` join the utility classes.

This is a visible change — every value moved up. Notice goes 1.5 → 1.75, the text inputs 1.4 → 1.5 (which changes their control height), and toggle and stat-tile labels 1.25 → 1.375.

**Validation timing.** `markInteracted` fired on every keystroke, so "after first interaction" meant after the first _character_: typing `j` into a required email field reddened it mid-word. Only blur, change, and a rejected submit promote a field now, and refocusing returns it to a clean state until the next blur.

`ds-checkbox` and `ds-searchable-select` bypassed the validation mixin entirely. Checkbox was red on mount when `required`, ignored `showValidity()`, and overwrote a consumer-assigned `invalid` — which silently wiped server-side errors on a toggle. Searchable-select could never reveal its error on a rejected submit. Both now go through the mixin.

**Field messages.** The footer was removed entirely when a field had nothing to say, so an error appearing added a row plus a gap and pushed the rest of the form down. The row is now always rendered, sized to one line from the font-size and line-height tokens, with description and error swapping in place within it. Dense layouts opt out with the `no-message-space` attribute.
