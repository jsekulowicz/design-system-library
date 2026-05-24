# @jsekulowicz/ds-components

## 0.9.12

### Patch Changes

- ff033eb: - `ds-dialog`'s body now actually lets focus outlines escape its inline padding edge. The previous fix added `overflow-clip-margin` but kept `overflow-y: auto`, and per spec `overflow-clip-margin` only applies when `overflow` is `clip` — so it was a no-op and a focused `ds-select` or `ds-text-field` still had its left/right outline shaved off. Switched to `overflow-x: clip; overflow-y: auto` with `overflow-clip-margin-inline`, which gives outlines ~8px of breathing room on the inline axis while preserving block-axis scrolling.
- 05278e7: - `ds-page-shell`'s `aside` and `main` regions no longer clip focus outlines on the inline axis. The aside already used `overflow-x: clip; overflow-y: auto;` so a focused `ds-nav-item` near the inline edge had its left/right outline shaved off; added `overflow-clip-margin-inline: var(--ds-space-2)` to let outlines escape while preserving the vertical scroll. `main` was `overflow: auto` (both axes scroll), where `overflow-clip-margin` has no effect by spec — switched it to `overflow-x: clip; overflow-y: auto` so the inline axis stops being a scrollport and outlines get the same breathing room. Consumers who relied on horizontal page scrolling now need to enable it on their own wrapper.

## 0.9.11

### Patch Changes

- a08e779: - `ds-dialog`'s body region no longer clips focus outlines (or any other decoration that extends a few pixels beyond a child's border box). The body needs `overflow-y: auto` for scroll, and `overflow-y` clipping applies to both axes by spec, so previously a focused `ds-select` or `ds-text-field` inside a dialog showed its top/bottom outline but had the left/right sides shaved off where they crossed the body's padding edge. Added `overflow-clip-margin: var(--ds-space-2)` so non-scrolling overflow (outlines, ring decorations, popover shadows) gets ~8px of breathing room beyond the clip box before being trimmed; scrolling content still clips at the same boundary it did before.

## 0.9.10

### Patch Changes

- 89ba94e: - `ds-card`'s `.body` now grows to fill leftover height (`flex: 1`) regardless of orientation. Previously this only applied to horizontal cards, which meant that when a parent grid or flex container stretched several vertical cards to a common height, their bodies stayed content-sized and their actions / footer rows ended up at different Y positions — `Card A` footer halfway down, `Card B` footer at the bottom, etc. With body growing, the bottom block (actions, footer) is anchored to the card's bottom edge so footers line up across rows. Cards in an auto-height context are unchanged — body still wraps its content because there's no leftover space to absorb. The narrow-container override that resets body back to `flex: unset` for horizontal cards is unchanged.
- 3537373: - `ds-dialog`'s header close button is now a `ds-button` (variant=ghost, size=md, square) with the `x-mark` icon instead of a hand-rolled `<button>` + inline SVG. Same `part="close-button"` exposure, same `Close` aria-label, and clicks still emit `ds-close` with `{ returnValue: 'close' }`. Visual upshot: the hit area grows from 32px to ds-button's sm size, hover / focus / disabled states match every other action in the system, and the button sits closer to the card's top-right corner via negative margin offsets that absorb part of `ds-card`'s padding instead of leaving the X stranded mid-padding. The X icon's size is now 2xl.

## 0.9.9

### Patch Changes

- a317876: - `ds-dialog` normalises any element slotted into the `title` slot. Previously a consumer who wrote `<h2 slot="title">Foo</h2>` (a perfectly reasonable semantic choice) got the inner heading's UA defaults applied on top of the dialog's own `.title-text` styling — a `font-size: 1.5em` compound that made the title visibly larger than `--ds-font-size-xl`, plus large UA `margin-block` that pushed the dialog body down. Added a scoped `.title-text ::slotted(*) { font: inherit; margin: 0; letter-spacing: inherit; }` so plain text, spans, and h1-h6 all render at the dialog's intended size with no extra spacing.
- 81e2db9: - `ds-select` now renders its dropdown via the Popover API. Browsers that support `HTMLElement.prototype.showPopover` hoist the listbox into the top layer, so it escapes any `overflow: hidden` / `overflow: auto` ancestor (dialogs, scroll containers, fixed-height panels) instead of being clipped or expanding the container. JS positions the popover under the trigger via `position: fixed` and the trigger's bounding rect, flipping above when there isn't enough room below. Scroll and resize listeners re-position the popover while it's open, and the listeners self-clean on close / disconnect. Browsers without Popover API support keep the existing in-flow `position: absolute` behaviour so they still work — they just clip in dialogs as before.

## 0.9.8

### Patch Changes

- 08486eb: - `ds-table-pagination` no longer flashes its active page button back to the muted surface colour on hover. The generic `button:hover:not(:disabled)` rule was outranking the `[aria-current="page"]` rule on specificity, so the navy/accent active state was overwritten with grey as soon as the pointer touched it. Added an explicit `button[aria-current="page"]:hover:not(:disabled)` step using the existing `--ds-color-accent-hover` token, so the active button stays on-brand throughout hover.

## 0.9.7

### Patch Changes

- d72c7ef: - `ds-table-pagination` now adapts to narrow containers automatically. A ResizeObserver flips the new reflected `compact` attribute on whenever the host renders below ~480px. In compact mode the Previous / Next buttons collapse to icons only (their text label is hidden but stays in the DOM so consumers can re-show it via `::part(prev-next-label)`), the visible page range tightens to "first … current … last", and `sibling-count` is forced to 0. The `compact` boolean property / attribute can also be set explicitly by consumers if they want to opt into the layout at wider widths.
  - `buildPaginationRange` no longer silently clamps `maxVisiblePages` up to 5. The minimum is now 3, which is what the new compact mode needs. Callers that were already passing 5+ are unaffected.
  - The Previous / Next button now exposes its slotted label through a new `prev-next-label` csspart, so consumers can target the text region (e.g. to keep labels visible at narrow widths) without leaking into other parts of the button.

## 0.9.6

### Patch Changes

- 2349175: - `ds-table` no longer renders its `toolbar` and `footer` wrapper divs when nothing is slotted into them. Previously both wrappers were always in the DOM (just hidden via `:empty { display: none }`), which gave them part(toolbar) / part(footer) presence even when unused and could interfere with consumer CSS that targets those parts. The component now mirrors the existing `caption` slot pattern: a MutationObserver tracks whether any element with `slot="toolbar"` or `slot="footer"` is present and skips rendering the wrapper otherwise.

## 0.9.5

### Patch Changes

- 29debdf: - Expose the `<table>`'s outer scroll wrapper as `part(scroll)` on `ds-table`. Consumers can now delegate vertical scrolling to it (or re-target the scroller entirely) without having to break the table layout from outside. Useful for fixed-header + scrolling-tbody patterns where the host needs to be a flex column and the scroll wrapper needs to carry the remaining height.

## 0.9.4

### Patch Changes

- 4d01634: - Move nested `ds-nav-group` item indentation onto each child nav control and add spacing between the group heading and its nested items.

## 0.9.3

### Patch Changes

- 84314fc: - Stretch `ds-nav-item` controls to full width when rendered inside `ds-nav-group`.
- 1dcaf00: - Move nested `ds-nav-group` item indentation onto each slotted `ds-nav-item` and add spacing between the group heading and its nested items.

## 0.9.2

### Patch Changes

- baf76ce: - Render the internal `<caption>` element only when `slot="caption"` content is provided.
  - Add `responsive="stack" | "scroll"` to `ds-table`, defaulting to stacked rows in narrow containers.
  - Make the table skeleton use compact stacked cards in narrow containers when responsive stacking is enabled.
  - Align stacked table skeleton cells with the real label/value mobile layout and allow long stacked content to wrap.

## 0.9.1

### Patch Changes

- 9b0edc7: - Treat `ds-table` `loading` as a boolean property without reflecting it to a string attribute.
  - Parse `loading="false"` and `loading="0"` as false for string-based integrations.
  - Prioritize the skeleton state when `loading` is true and no rows are present; keep the loading overlay for refreshes with existing rows.

## 0.9.0

### Minor Changes

- a4d7075: - Make `lg` the default `ds-icon` size and use a distinct rem-based size scale from `sm` through `3xl`.
  - Add table loading states with a customizable `loading` slot and skeleton fallback rendering while columns are not initialized.
  - Tune `ds-skeleton` shimmer timing, make the animation loop seamless, and disable shimmer for reduced-motion users.
  - Add opt-in token-based utility CSS entry points for spacing, layout, and typography helpers.

## 0.8.0

### Minor Changes

- acde301: - e8660bc: Increase spacings from ds-space-1 to ds-space-2 in case of leading and trailing slots and also some horizontal list elements
  - acde301: Generate and export all Heroicons outline icons as `@jsekulowicz/ds-components/icon/<name>` modules, with `icon/all` and `icon/names` helper exports.

## 0.7.2

### Patch Changes

- 8626736: Add standalone NavGroup docs, align nav group heading styles with nav items, and avoid rendering an empty nav group icon wrapper.

## 0.7.1

### Patch Changes

- 4c544df: Constrain `ds-page-shell` to the viewport so its internal main region owns page scrolling instead of the document.

## 0.7.0

### Minor Changes

- d29c384: `ds-top-bar` and `ds-footer` now wrap their content in an inner wrapper whose max-width is configurable via `--ds-top-bar-content-max-width` / `--ds-footer-content-max-width` (default `none`). Chrome (background, border, fixed height) still spans the full element width.

  `ds-page-shell` sets both properties to `var(--ds-page-shell-max-width)` on the embedded top-bar and on any slotted `ds-footer`, so on viewports wider than the shell's content cap the top-bar's brand/actions and the footer's start/end regions align with the aside + main columns below.

## 0.6.1

### Patch Changes

- f71cbfb: Give `ds-page-shell` real 16px inline padding below the desktop breakpoint instead of relying on scrollbar gutter width to approximate the mobile content spacing.

## 0.6.0

### Minor Changes

- 529dda9: Replace the former Navbar component with TopBar and align the surrounding page chrome.
  - `ds-navbar` has been removed in favor of `ds-top-bar`. The new TopBar is a simpler application chrome component with `brand` and `actions` slots only; primary navigation should live in `ds-sidenav` or other navigation components.
  - Component package imports move from `@jsekulowicz/ds-components/navbar` to `@jsekulowicz/ds-components/top-bar`.
  - React wrapper consumers should replace `Navbar` with `TopBar`.
  - `ds-page-shell` now composes `ds-top-bar` in its header, preserves the footer slot without an extra shell wrapper, and keeps main/footer/header alignment consistent.
  - `ds-footer` and `ds-top-bar` now use fixed chrome heights with symmetric inline padding.
  - Breadcrumb item focus rings have a little more horizontal breathing room.

## 0.5.4

### Patch Changes

- c2d60d1: Center `ds-page-shell` brand slot content vertically in the header.

## 0.5.3

### Patch Changes

- f5ff508: Add the `3xl` icon size at `1.75rem` and use it for design-system mobile menu buttons.

## 0.5.2

### Patch Changes

- fdb812e: Add the `user-circle` icon export, keep mobile menu triggers as bars icons while open, order mobile `ds-page-shell` header content as brand, menu toggle, then header actions, and hide `ds-navbar`'s mobile toggle when no links are slotted.

## 0.5.1

### Patch Changes

- de6c4d6: Align `ds-sidenav` and mobile drawer spacing with page-shell chrome, and add a `drawer-brand` slot for mobile drawer branding while preserving compact horizontal padding in collapsed mode.

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
  - @jsekulowicz/ds-core@0.5.0
  - @jsekulowicz/ds-tokens@0.5.0

## 0.4.1

### Patch Changes

- ba32207: Two bug fixes raised from a consumer integration:
  - **`FormControlMixin` (ds-core):** form-associated DS controls (`ds-text-field`, `ds-select`, `ds-checkbox`, `ds-radio`, …) now submit the surrounding form when **Enter** is pressed inside the field, matching native input behaviour. The host listens for `keydown` and calls `internals.form.requestSubmit()` (falling back to `closest('form')` for environments without full `ElementInternals` form association). Bare Enter only — modifier keys, IME composition, disabled state, and `textarea`-typed controls are skipped.
  - **`ds-page-shell`:** `<main>` now declares `min-width: 0` and `overflow: auto`. Without `min-width: 0`, a CSS grid item's intrinsic minimum is `auto`, so a wide descendant (long unwrapped string, wide table, `flex-wrap: nowrap` row) would push the `1fr` content track past the viewport and cause the whole page to scroll horizontally. `overflow: auto` keeps any truly oversized content scrollable inside `<main>` (rather than clipping it or letting it escape into the page chrome).

- Updated dependencies [ba32207]
  - @jsekulowicz/ds-core@0.4.1
  - @jsekulowicz/ds-tokens@0.4.1

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
  - @jsekulowicz/ds-tokens@0.4.0
  - @jsekulowicz/ds-core@0.4.0

## 0.3.1

### Patch Changes

- 25209ac: ### `ds-page-shell`: brand and main content now share the same x coordinate

  The 0.3.0 content cap left a 20 px gap between the brand text in the header and the first column of main content — header chrome had its horizontal padding on the `<header>` outer element, while main's padding was inside the centred column.

  The horizontal padding now lives on `.shell-inner` instead of `<header>`/`<footer>`, so brand, main content, and footer content all start at the same x at any viewport width. Header and footer chrome (border, sticky backdrop) still extend to the viewport edges.

- Updated dependencies [25209ac]
  - @jsekulowicz/ds-tokens@0.3.1
  - @jsekulowicz/ds-core@0.3.1

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
  - @jsekulowicz/ds-tokens@0.3.0
  - @jsekulowicz/ds-core@0.3.0

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
  - @jsekulowicz/ds-tokens@0.2.0
  - @jsekulowicz/ds-core@0.2.0
