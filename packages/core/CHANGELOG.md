# @jsekulowicz/ds-core

## 0.71.0

### Minor Changes

- ccff9b5: Blank anchor attributes are now omitted instead of rendered empty. `ds-breadcrumb-item` (`target`, `rel`, `download`, `hreflang`, `type`, `referrerpolicy`), `ds-nav-item` and `ds-button` (`target`, `rel`) and `ds-link` (`target`) treated an empty string as a value and passed it through, so binding an unset field produced `rel=""` on the `<a>`. They now drop the attribute, matching what an unset property already did.

  One case changes behaviour rather than just markup: `download=""` on an `<a>` means "download this, deriving the filename from the URL", so a `ds-breadcrumb-item` given an empty `download` used to download and now navigates. Pass a filename, or `download` as a bare attribute on your own anchor, if you relied on it.

  `@jsekulowicz/ds-core` exports the `omitWhenBlank` helper this uses.

## 0.68.1

### Patch Changes

- a74a94f: Align `ds-checkbox` and `ds-radio` controls with the first line of a wrapping label instead of centering them on the whole text block, so a label that runs onto several lines keeps its box where reading starts.

  Stop form controls stealing interaction from interactive content slotted into them. Space and Enter on a link or button inside a checkbox or radio label now activate it rather than toggling the control, clicking one no longer selects a radio, and Enter no longer submits the surrounding form. Consumers that worked around this with `@click.stop` or similar on the slotted element can drop it.

## 0.61.0

### Minor Changes

- f569725: Rebuild the line-height scale, validate fields on blur, and reserve a line for the field message.

  **Line heights.** The `--ds-line-height-*` tokens existed but almost nothing used them: thirteen rules across the components hardcoded five different values, and the scale had no entry for the `line-height: 1` that single-line controls need. The scale is now `none` 1, `tight` 1.25, `snug` 1.375, `normal` 1.5, `relaxed` 1.75, and every component style consumes it. `.ds-leading-none` and `.ds-leading-snug` join the utility classes.

  This is a visible change — every value moved up. Notice goes 1.5 → 1.75, the text inputs 1.4 → 1.5 (which changes their control height), and toggle and stat-tile labels 1.25 → 1.375.

  **Validation timing.** `markInteracted` fired on every keystroke, so "after first interaction" meant after the first _character_: typing `j` into a required email field reddened it mid-word. Only blur, change, and a rejected submit promote a field now, and refocusing returns it to a clean state until the next blur.

  `ds-checkbox` and `ds-searchable-select` bypassed the validation mixin entirely. Checkbox was red on mount when `required`, ignored `showValidity()`, and overwrote a consumer-assigned `invalid` — which silently wiped server-side errors on a toggle. Searchable-select could never reveal its error on a rejected submit. Both now go through the mixin.

  **Field messages.** The footer was removed entirely when a field had nothing to say, so an error appearing added a row plus a gap and pushed the rest of the form down. The row is now always rendered, sized to one line from the font-size and line-height tokens, with description and error swapping in place within it. Dense layouts opt out with the `no-message-space` attribute.

## 0.60.0

### Minor Changes

- 4c34dc3: Type the attributes that components forward to inner elements, so lit template analyzers stop
  reporting `no-incompatible-type-binding` in editors.

  `@jsekulowicz/ds-core` now exports `AriaRole`, `AriaBoolean`, `AriaChecked`, `AriaInvalid`,
  `AriaHasPopup`, `LinkTarget` and `AutocompleteToken`. `ds-button`'s `role`/`aria-*` properties,
  `ds-breadcrumb-item`'s `target`/`referrerpolicy`, and the `autocomplete` property on `ds-text-field`
  and `ds-text-area` use them instead of `string`.

  TypeScript consumers passing arbitrary strings to these properties will now see a type error; the
  runtime behaviour of the underlying attributes is unchanged.

  Optional attribute bindings moved from `?? nothing` to the `ifDefined` directive throughout. Same
  rendered output — the attribute is still omitted when the value is absent.

### Patch Changes

- ecbbafe: Stop shipping stale build output, and drop two export paths that no longer resolve.

  `@jsekulowicz/ds-core` declared `./theme-controller` and `./responsive` in its export map, but
  neither source file exists any more — importing either would fail on any clean build. Both entries
  are removed.

  No package cleaned `dist/` before `tsc`, so the published tarballs carried artefacts from deleted
  modules: 23 files in `ds-components` (including the removed `molecules/field` and
  `organisms/navbar` components) and 2 in `ds-core`. Every package build now cleans first.

  `ds-react` no longer declares a `lit` dependency it never imported.

## 0.54.1

### Patch Changes

- 1684749: Stop form controls turning red before the user has touched them. `ds-text-field`, `ds-text-area` and `ds-color-picker` synced their `invalid` flag from native validity in `firstUpdated`, so a `required` field with an empty value was styled as an error from the moment it rendered — a sign-up form opened with every input outlined in danger.

  `FormControlMixin` now tracks interaction: `markInteracted()` records that the user has typed in, committed or left the control, and `resolveInvalid(current, fromValidity)` returns what `invalid` should become, or `null` to leave it alone. The form still receives the true validity via `setValidity` from the first render, so submit-time validation and `:invalid` form matching are unchanged — only the visual flag waits.

  The same change fixes a second problem: `resolveInvalid` returns `null` once a consumer has assigned `invalid` itself, so an app-supplied error (a duplicate name, a rejected credential — anything the browser cannot know about) is no longer wiped out by the next keystroke or blur. Consumers that worked around this by re-asserting `invalid` on `ds-change` can drop the workaround.

  Text fields and text areas now also validate on blur, so tabbing out of a required field you left empty flags it. And `ds-form` calls the new `showValidity()` on its controls when a submit is rejected — the field that blocked it is exactly the one nobody visited, so it must not stay unstyled.

## 0.50.0

### Minor Changes

- 18eb75a: Stable `ds-button` loading width and a spinner that actually spins.
  - `ds-button` gains `loading-label`: while `loading`, it replaces the slotted label and pins the
    button to the wider of the two labels, so toggling `loading` no longer reflows neighbouring
    controls.
  - Without `loading-label`, the leading slot now shares a grid cell with the spinner instead of
    being swapped out, so entering the loading state can never shrink the button.
  - Fixed the spinner arc: `stroke-dasharray` equalled the circle's circumference, so it drew a
    closed ring and rotating it was a visual no-op. Extracted to a shared module reused by
    `ds-button`, `ds-nav-item` and `ds-searchable-select`, all of which had the same bug.
  - `reducedMotionStyles` now exempts elements marked `.ds-allow-motion`. Spinners are essential
    status feedback, so they keep animating under `prefers-reduced-motion` at roughly half speed
    instead of being frozen by the global clamp.

## 0.37.0

### Minor Changes

- d6d8d57: New `visuallyHiddenStyles` export; `DsElement` base styles now include a `.visually-hidden` class, so every component can hide screen-reader-only content without hand-rolling the pattern.

  Breaking: removed unused exports `ThemeController`, `ContainerSizeController`, `prefersDarkScheme`, `prefersReducedMotion` and `ensureId` (and the `Theme`/`BreakpointName` types). None had consumers, docs or tests.

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

## 0.4.1

### Patch Changes

- ba32207: Two bug fixes raised from a consumer integration:
  - **`FormControlMixin` (ds-core):** form-associated DS controls (`ds-text-field`, `ds-select`, `ds-checkbox`, `ds-radio`, …) now submit the surrounding form when **Enter** is pressed inside the field, matching native input behaviour. The host listens for `keydown` and calls `internals.form.requestSubmit()` (falling back to `closest('form')` for environments without full `ElementInternals` form association). Bare Enter only — modifier keys, IME composition, disabled state, and `textarea`-typed controls are skipped.
  - **`ds-page-shell`:** `<main>` now declares `min-width: 0` and `overflow: auto`. Without `min-width: 0`, a CSS grid item's intrinsic minimum is `auto`, so a wide descendant (long unwrapped string, wide table, `flex-wrap: nowrap` row) would push the `1fr` content track past the viewport and cause the whole page to scroll horizontally. `overflow: auto` keeps any truly oversized content scrollable inside `<main>` (rather than clipping it or letting it escape into the page chrome).

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

## 0.3.1

### Patch Changes

- 25209ac: ### `ds-page-shell`: brand and main content now share the same x coordinate

  The 0.3.0 content cap left a 20 px gap between the brand text in the header and the first column of main content — header chrome had its horizontal padding on the `<header>` outer element, while main's padding was inside the centred column.

  The horizontal padding now lives on `.shell-inner` instead of `<header>`/`<footer>`, so brand, main content, and footer content all start at the same x at any viewport width. Header and footer chrome (border, sticky backdrop) still extend to the viewport edges.

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
