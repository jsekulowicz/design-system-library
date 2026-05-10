---
"@jsekulowicz/ds-tokens": patch
"@jsekulowicz/ds-core": patch
"@jsekulowicz/ds-components": patch
"@jsekulowicz/ds-react": patch
---

### `ds-page-shell`: brand and main content now share the same x coordinate

The 0.3.0 content cap left a 20 px gap between the brand text in the header and the first column of main content — header chrome had its horizontal padding on the `<header>` outer element, while main's padding was inside the centred column.

The horizontal padding now lives on `.shell-inner` instead of `<header>`/`<footer>`, so brand, main content, and footer content all start at the same x at any viewport width. Header and footer chrome (border, sticky backdrop) still extend to the viewport edges.
