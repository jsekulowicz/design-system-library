---
"@jsekulowicz/ds-components": minor
---

Add sizing utility classes that reference the existing `--ds-space-*` scale, for width, height and square dimensions.

- `.ds-w-{n}`, `.ds-h-{n}`, `.ds-size-{n}` (square) over the full space scale (`0`–`32`).
- Keyword sizes: `.ds-w-auto|full|screen|min|max|fit` and the matching `.ds-h-*`, plus `.ds-size-full`.
- Constraints: `.ds-min-w-*`, `.ds-min-h-*`, `.ds-max-w-*`, `.ds-max-h-*`.

Shipped as a separate, independently-importable file (`@jsekulowicz/ds-components/css/utilities/sizing.css`) and included in the `css/utilities.css` barrel. All classes live in `@layer ds.utilities` with plain class selectors, so a consumer-side purge/content-scan step can eliminate unused classes.
