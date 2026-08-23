---
'@jsekulowicz/ds-components': patch
---

Align `ds-checkbox` and `ds-radio` controls with the first line of a wrapping label instead of centering them on the whole text block, so a label that runs onto several lines keeps its box where reading starts.

Stop stealing interaction from interactive content slotted into a checkbox or radio label. Space and Enter on a slotted link or button now activate it rather than toggling the control and swallowing the key, and clicking one no longer selects a radio. Consumers that worked around this with `@click.stop` or similar on the slotted element can drop it.
