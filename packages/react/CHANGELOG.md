# @jsekulowicz/ds-react

## 0.9.6

### Patch Changes

- Updated dependencies [2349175]
  - @jsekulowicz/ds-components@0.9.6

## 0.9.5

### Patch Changes

- Updated dependencies [29debdf]
  - @jsekulowicz/ds-components@0.9.5

## 0.9.4

### Patch Changes

- Updated dependencies [4d01634]
  - @jsekulowicz/ds-components@0.9.4

## 0.9.3

### Patch Changes

- Updated dependencies [84314fc]
- Updated dependencies [1dcaf00]
  - @jsekulowicz/ds-components@0.9.3

## 0.9.2

### Patch Changes

- Updated dependencies [baf76ce]
  - @jsekulowicz/ds-components@0.9.2

## 0.9.1

### Patch Changes

- Updated dependencies [9b0edc7]
  - @jsekulowicz/ds-components@0.9.1

## 0.9.0

### Patch Changes

- Updated dependencies [a4d7075]
  - @jsekulowicz/ds-components@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [acde301]
  - @jsekulowicz/ds-components@0.8.0

## 0.7.2

### Patch Changes

- Updated dependencies [8626736]
  - @jsekulowicz/ds-components@0.7.2

## 0.7.1

### Patch Changes

- Updated dependencies [4c544df]
  - @jsekulowicz/ds-components@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [d29c384]
  - @jsekulowicz/ds-components@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [f71cbfb]
  - @jsekulowicz/ds-components@0.6.1

## 0.6.0

### Minor Changes

- 529dda9: Replace the former Navbar component with TopBar and align the surrounding page chrome.
  - `ds-navbar` has been removed in favor of `ds-top-bar`. The new TopBar is a simpler application chrome component with `brand` and `actions` slots only; primary navigation should live in `ds-sidenav` or other navigation components.
  - Component package imports move from `@jsekulowicz/ds-components/navbar` to `@jsekulowicz/ds-components/top-bar`.
  - React wrapper consumers should replace `Navbar` with `TopBar`.
  - `ds-page-shell` now composes `ds-top-bar` in its header, preserves the footer slot without an extra shell wrapper, and keeps main/footer/header alignment consistent.
  - `ds-footer` and `ds-top-bar` now use fixed chrome heights with symmetric inline padding.
  - Breadcrumb item focus rings have a little more horizontal breathing room.

### Patch Changes

- Updated dependencies [529dda9]
  - @jsekulowicz/ds-components@0.6.0

## 0.5.4

### Patch Changes

- Updated dependencies [c2d60d1]
  - @jsekulowicz/ds-components@0.5.4

## 0.5.3

### Patch Changes

- Updated dependencies [f5ff508]
  - @jsekulowicz/ds-components@0.5.3

## 0.5.2

### Patch Changes

- Updated dependencies [fdb812e]
  - @jsekulowicz/ds-components@0.5.2

## 0.5.1

### Patch Changes

- Updated dependencies [de6c4d6]
  - @jsekulowicz/ds-components@0.5.1

## 0.5.0

### Minor Changes

- e7b6442: Two layout improvements to `ds-page-shell` raised from a consumer integration:
  - **The desktop aside now sits flush with its column edge.** The aside previously used `scrollbar-gutter: stable`, permanently reserving ~14 px on the inline-end side for a potential scrollbar. Stacked with `<main>`'s padding, that produced a noticeably asymmetric horizontal gap between aside content and main content that consumers couldn't account for in their own layout. The base aside selector drops the reservation so `<main>` solely owns the gap; the scrollbar appears on demand when the aside genuinely overflows. The mobile drawer keeps `scrollbar-gutter: auto` as before.
  - **New `aside-end` slot.** Mirrors the existing `aside` (inline-start) for inline-end side regions — table-of-contents columns, contextual help panels, etc. Driven by a new `end-label` attribute (defaults to `Secondary navigation`) applied as `aria-label` on the secondary `<aside>`. The grid template adapts to which sides are populated (`auto 1fr auto` / `1fr auto` / `auto 1fr` / `1fr`). Mobile layout hides the inline-end region in v1; consumers can re-surface it via `::part(aside-end)`. The primary aside now also receives `aria-label` from `menu-label` for a11y parity.

### Patch Changes

- 96eeb67: **`ds-page-shell` — symmetric scrollbar gutter on `<main>`.** When `<main>`'s content exceeds the viewport, `overflow: auto` brings in a vertical scrollbar that consumed ~14 px on the inline-end side only, leaving the inline-start padding intact. Visually the content sat off-centre — smaller left margin than right. Adds `scrollbar-gutter: stable both-edges` to `<main>` so a gutter is reserved on both inline sides regardless of whether the scrollbar is currently visible; horizontal content position stays consistent and both visual margins match.

  Below the desktop breakpoint, `<main>` now uses compact responsive padding: `var(--ds-space-4) var(--ds-space-2)`. This keeps 20 px padding on desktop, while mobile and tablet layouts use 16 px vertical and 8 px horizontal padding without changing the symmetric scrollbar gutter behavior.

  Page chrome padding is now aligned across `ds-page-shell`, `ds-footer`, and `ds-navbar`: header and footer regions use 20 px horizontal padding on desktop and 16 px below the desktop breakpoint.

  `ds-icon` now supports `xl` (20 px) and `2xl` (24 px) sizes, and the PageShell/Navbar menu toggles use `xl` for clearer 20 px menu icons. The labeled icon role binding now uses `ifDefined` so Lit's type checker no longer reports an incompatible `role` binding.

- Updated dependencies [e7b6442]
- Updated dependencies [96eeb67]
  - @jsekulowicz/ds-components@0.5.0

## 0.4.1

### Patch Changes

- ba32207: Two bug fixes raised from a consumer integration:
  - **`FormControlMixin` (ds-core):** form-associated DS controls (`ds-text-field`, `ds-select`, `ds-checkbox`, `ds-radio`, …) now submit the surrounding form when **Enter** is pressed inside the field, matching native input behaviour. The host listens for `keydown` and calls `internals.form.requestSubmit()` (falling back to `closest('form')` for environments without full `ElementInternals` form association). Bare Enter only — modifier keys, IME composition, disabled state, and `textarea`-typed controls are skipped.
  - **`ds-page-shell`:** `<main>` now declares `min-width: 0` and `overflow: auto`. Without `min-width: 0`, a CSS grid item's intrinsic minimum is `auto`, so a wide descendant (long unwrapped string, wide table, `flex-wrap: nowrap` row) would push the `1fr` content track past the viewport and cause the whole page to scroll horizontally. `overflow: auto` keeps any truly oversized content scrollable inside `<main>` (rather than clipping it or letting it escape into the page chrome).

- Updated dependencies [ba32207]
  - @jsekulowicz/ds-components@0.4.1

## 0.4.0

### Minor Changes

- 1dcf3a2: Update component visuals, responsive behavior, and release tooling.
  - Added `ds-button square` for icon-sized square buttons.
  - Changed the display font token from Fraunces to Source Serif 4.
  - Refined form and card action alignment across mobile, tablet, and desktop layouts.
  - Improved `ds-page-shell` footer handling so empty footers do not render and slotted footer content is tracked dynamically.
  - Shared common select/dropdown styles between `ds-select` and `ds-searchable-select`.
  - Added Playwright visual regression coverage and CI support for visual snapshot updates.
  - Improved Storybook docs previews, including viewport-sized examples and live light/dark theme sync inside story iframes.
  - Added lint coverage for Storybook files and unused imports.

### Patch Changes

- Updated dependencies [1dcf3a2]
  - @jsekulowicz/ds-components@0.4.0

## 0.3.1

### Patch Changes

- 25209ac: ### `ds-page-shell`: brand and main content now share the same x coordinate

  The 0.3.0 content cap left a 20 px gap between the brand text in the header and the first column of main content — header chrome had its horizontal padding on the `<header>` outer element, while main's padding was inside the centred column.

  The horizontal padding now lives on `.shell-inner` instead of `<header>`/`<footer>`, so brand, main content, and footer content all start at the same x at any viewport width. Header and footer chrome (border, sticky backdrop) still extend to the viewport edges.

- Updated dependencies [25209ac]
  - @jsekulowicz/ds-components@0.3.1

## 0.3.0

### Minor Changes

- 651ccb8: ### `ds-page-shell` caps and centres its content column on wide viewports

  The shell now keeps a single centred column for header inner content, the aside + main row, and footer inner content. On viewports above the cap (default `90rem` / 1440 px), brand, sidenav, and main all line up vertically; below the cap, layout is unchanged.
  - **New CSS custom property: `--ds-page-shell-max-width`.** Defaults to `90rem`. Consumers override per-app, e.g. `ds-page-shell { --ds-page-shell-max-width: 96rem; }` for a wider dashboard or `64rem` for a marketing-narrow look.
  - **Header and footer chrome stay full-bleed.** The sticky header's border + backdrop blur and the footer's border still extend to the viewport edges — only the content inside each is centred. That preserves the "application chrome" feel without sprawl.
  - **Aside + main share the cap.** When a sidenav is present, sidenav width + main width together equal the cap (sidenav at its natural width, main flexes to fill the rest). When the aside slot is empty, main alone fills the centred column.
  - **Mobile drawer behaviour is unchanged.** Below 768 px the aside still becomes an absolute drawer over main with backdrop and Escape-to-close.

  ### Internal restructure

  The shadow DOM gained two intermediate wrappers: `.shell-inner` inside `<header>` and `<footer>`, and a `.shell-body` (exposed as `part="body"`) wrapping aside + main. Direct selectors like `aside`, `main`, `.menu-toggle`, `.mobile-backdrop` are unchanged, so most consumer styles continue to work. If you were targeting the host's grid template directly with custom CSS, expect to update — the host now uses flex column with grid only inside `.shell-body`.

### Patch Changes

- Updated dependencies [651ccb8]
  - @jsekulowicz/ds-components@0.3.0

## 0.2.0

### Minor Changes

- 69f9cb6: ### New atoms
  - **`ds-divider`** — hairline separator with built-in vertical breathing room (--ds-space-3 top + bottom by default; vertical orientation does the equivalent on the inline axis). Renders `role="separator"` for assistive tech. New mdx + stories under Atoms/Divider.
  - **`ds-list` + `ds-list-item`** — vertical stack with `bordered` (default) or `plain` variants. Items expose leading / default / trailing slots; leading and trailing wrappers auto-hide when their slot is empty. The bordered variant doesn't clip overflow, so popovers anchored inside a row escape the list correctly.

  ### New icons (Heroicons v2)

  `eye`, `eye-slash`, `plus`, `moon`, `sun`. Available as `@jsekulowicz/ds-components/icon/<name>` side-effect imports.

  ### `ds-page-shell`
  - **Auto-detects empty `aside` slot.** When nothing is slotted in, the host reflects `aside-empty`, collapses to a single-column grid, and skips rendering the hamburger toggle, drawer, and aside region. Replaces the need for a `no-aside` prop — single-section apps work out of the box.
  - **Auto-detects empty `footer` slot.** Reflects `footer-empty` for downstream styling hooks.
  - **Footer wrapper is now bare** — no padding, no border-top. Slotted content (e.g. `ds-footer`) provides its own. Removes the duplicate divider visible in the SettingsPage example.
  - **Header padding** is now `--ds-space-2 / --ds-space-5` (8 px / 20 px); `align-items: center`. The horizontal padding matches main content padding so brand and header actions align with the start/end of the page.

  ### `ds-card`
  - Header (eyebrow + title) and footer regions auto-hide when their slots are empty — no more empty header strip on a body-only card.

  ### `ds-button`
  - Horizontal padding consolidated to `0 var(--ds-space-2)` across `sm` / `md` / `lg` (was `0 var(--ds-space-4)` and `0 var(--ds-space-5)`). Buttons now sit closer to their adjacent text and stay compact in toolbars.

  ### `ds-tooltip`
  - New `full-width` reflective attribute. When set, the host and the inner anchor stretch to fill their parent, so a tooltipped full-width button stays full-width instead of collapsing to inline-flex.

  ### `ds-breadcrumb-item` and `ds-badge`
  - Drop their horizontal cell padding. The trail's first item and badges now align flush with whatever sits below them (page title, content). Badges keep their internal 2 px / `--ds-space-2` padding for the chip shape.

  ### `ds-table-pagination`
  - Explicit `column-gap: --ds-space-4` / `row-gap: --ds-space-3`. Summary + nav stay on a single row at any reasonable width and only break onto two lines on truly narrow screens, with proper vertical breathing room when they do.

  ### `ds-footer`
  - Horizontal padding aligns with `ds-page-shell` header at `--ds-space-5` (was `--ds-space-6`) so when both pass through the page shell, the start and end edges line up exactly.

  ### Typography docs
  - Recommend `xl` (22 px) for page-level `h1`; `2xl`–`3xl` reserved for editorial moments.

### Patch Changes

- Updated dependencies [69f9cb6]
  - @jsekulowicz/ds-components@0.2.0
