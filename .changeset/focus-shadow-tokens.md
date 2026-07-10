---
"@jsekulowicz/ds-tokens": minor
---

Focus shadows are now theme-aware. `--ds-shadow-focus` moved from the primitive layer to the semantic layer, so the dark theme finally gets its lighter focus ring instead of the light-theme cobalt. New `--ds-shadow-focus-danger` token for invalid-control focus states.

Breaking: the `shadow` primitive export no longer has a `focus` key, and `base.css` no longer defines `--ds-shadow-focus` (both theme files still do — consumers loading `theme-default.css` are unaffected).
