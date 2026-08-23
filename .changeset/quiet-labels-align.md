---
'@jsekulowicz/ds-components': patch
'@jsekulowicz/ds-core': patch
---

Align `ds-checkbox` and `ds-radio` controls with the first line of a wrapping label instead of centering them on the whole text block, so a label that runs onto several lines keeps its box where reading starts.

Stop form controls stealing interaction from interactive content slotted into them. Space and Enter on a link or button inside a checkbox or radio label now activate it rather than toggling the control, clicking one no longer selects a radio, and Enter no longer submits the surrounding form. Consumers that worked around this with `@click.stop` or similar on the slotted element can drop it.
