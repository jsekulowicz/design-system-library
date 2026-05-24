---
"@jsekulowicz/ds-components": patch
---

- `ds-card`'s `.body` now grows to fill leftover height (`flex: 1`) regardless of orientation. Previously this only applied to horizontal cards, which meant that when a parent grid or flex container stretched several vertical cards to a common height, their bodies stayed content-sized and their actions / footer rows ended up at different Y positions — `Card A` footer halfway down, `Card B` footer at the bottom, etc. With body growing, the bottom block (actions, footer) is anchored to the card's bottom edge so footers line up across rows. Cards in an auto-height context are unchanged — body still wraps its content because there's no leftover space to absorb. The narrow-container override that resets body back to `flex: unset` for horizontal cards is unchanged.
