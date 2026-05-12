---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-tokens': minor
'@jsekulowicz/ds-core': minor
'@jsekulowicz/ds-react': minor
---

Update component visuals, responsive behavior, and release tooling.

- Added `ds-button square` for icon-sized square buttons.
- Changed the display font token from Fraunces to Source Serif 4.
- Refined form and card action alignment across mobile, tablet, and desktop layouts.
- Improved `ds-page-shell` footer handling so empty footers do not render and slotted footer content is tracked dynamically.
- Shared common select/dropdown styles between `ds-select` and `ds-searchable-select`.
- Added Playwright visual regression coverage and CI support for visual snapshot updates.
- Improved Storybook docs previews, including viewport-sized examples and live light/dark theme sync inside story iframes.
- Added lint coverage for Storybook files and unused imports.
