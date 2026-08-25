# Design System Library

A framework-agnostic design system built on **Lit** web components, grouped by purpose, themeable via a three-tier token layer, responsive by default, tree-shakable (JS and CSS), and accessible to WCAG 2.2 AA.

Live Storybook docs: https://jsekulowicz.github.io/design-system-library

## Packages

| Package                                               | Description                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`@jsekulowicz/ds-tokens`](./packages/tokens)         | Design tokens (primitive + semantic layers) + generated CSS themes                |
| [`@jsekulowicz/ds-core`](./packages/core)             | `DsElement` base class, `FormControlMixin` (ElementInternals), controllers, utils |
| [`@jsekulowicz/ds-components`](./packages/components) | Web components grouped by user-facing purpose                                     |
| [`@jsekulowicz/ds-react`](./packages/react)           | Thin React wrappers generated from the Custom Elements Manifest via `@lit/react`  |
| [`@ds/storybook`](./packages/storybook)               | Storybook docs site (live examples, API tables, design intent, foundations)       |

## Components

**Actions** - `ds-button`, `ds-link`

**Forms** - `ds-checkbox`, `ds-checkbox-group`, `ds-color-picker`, `ds-color-picker-input-color`, `ds-color-picker-swatch`, `ds-color-picker-swatch-group`, `ds-fieldset`, `ds-form`, `ds-radio`, `ds-radio-group`, `ds-range-input`, `ds-searchable-select`, `ds-segmented-control`, `ds-select`, `ds-select-option`, `ds-text-area`, `ds-text-field`

**Navigation** - `ds-breadcrumb`, `ds-breadcrumb-item`, `ds-menu`, `ds-menu-button`, `ds-menu-item`, `ds-nav-group`, `ds-nav-item`, `ds-sidenav`, `ds-tab`, `ds-tab-panel`, `ds-tabs`, `ds-top-bar`

**Feedback** - `ds-alert`, `ds-progress-bar`, `ds-skeleton`, `ds-toast`, `ds-toast-stack`

**Overlays** - `ds-dialog`, `ds-drawer`, `ds-popover-button`, `ds-tooltip`

**Data Display** - `ds-badge`, `ds-bar-chart`, `ds-card`, `ds-divider`, `ds-heatmap-calendar`, `ds-icon`, `ds-list`, `ds-list-item`, `ds-pie-chart`, `ds-share-bar`, `ds-stat-tile`, `ds-table`, `ds-table-pagination`, `ds-table-sort-button`

**Layout** - `ds-footer`, `ds-page-shell`, `ds-scrollable-page`

**Patterns** - `ds-settings-page`

## Getting started

```sh
pnpm install
pnpm build          # build all packages
pnpm dev            # start Storybook with watch mode
pnpm test           # Vitest unit tests across all packages
pnpm test:e2e       # Playwright end-to-end tests
pnpm test:a11y      # axe-core accessibility tests against every story
pnpm lint           # ESLint across all packages
pnpm typecheck      # TypeScript type-check across all packages
pnpm format         # Prettier write; `pnpm format:check` is the CI gate
```

The repo was reformatted wholesale in one commit. Skip it in `git blame`:

```sh
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

Contributing? Read [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) first.

## Consumer usage

### Install

```sh
pnpm add @jsekulowicz/ds-tokens @jsekulowicz/ds-components
```

For React projects, also install the React wrappers:

```sh
pnpm add @jsekulowicz/ds-react
```

The packages are public scoped npm packages. Consumers do not need npm authentication to install them.

### Import tokens and a component

```ts
// Load the default theme (light + dark, switches via data-ds-theme on <html>)
import '@jsekulowicz/ds-tokens/theme-default.css';

// Register individual components on demand (tree-shakable)
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/text-field/define';
```

### Use in HTML

```html
<ds-button variant="primary">Save</ds-button> <ds-text-field label="Email" type="email"></ds-text-field>
```

### Use in React

```tsx
import { Button, TextField } from '@jsekulowicz/ds-react';

export function MyForm() {
  return (
    <>
      <TextField label="Email" type="email" />
      <Button variant="primary">Save</Button>
    </>
  );
}
```

### Theming

Override semantic CSS custom properties on any ancestor to retheme all child components. No component source changes needed.

```css
:root {
  --ds-color-accent: #e2341d;
  --ds-color-accent-hover: #c12613;
  --ds-radius-sm: 12px;
  --ds-radius-md: 24px;
}
```

Dark mode is applied by setting `data-ds-theme="dark"` on `<html>`. Light mode is the default; `data-ds-theme="light"` makes it explicit. The `color-scheme` property is set automatically so native UI elements (scrollbars, form controls) follow the active theme.

### Class-only import (no side-effects)

```ts
import { DsButton } from '@jsekulowicz/ds-components/button';
customElements.define('ds-button', DsButton);
```

## Releases

Published packages use semver and are managed with Changesets:

| Package                      | Published to npm           |
| ---------------------------- | -------------------------- |
| `@jsekulowicz/ds-tokens`     | Yes                        |
| `@jsekulowicz/ds-core`       | Yes                        |
| `@jsekulowicz/ds-components` | Yes                        |
| `@jsekulowicz/ds-react`      | Yes                        |
| `@ds/storybook`              | No, private docs workspace |

### One-time npm setup

1. Make sure the npm account or organization owns the `@jsekulowicz` scope.
2. Create an npm access token that can publish packages in that scope.
3. Add the token to the GitHub repository secrets as `NPM_TOKEN`.

### Releasing a new version

1. Add a changeset on the feature branch:

   ```sh
   pnpm changeset
   ```

2. Select the changed public packages and choose the semver bump:
   - patch for fixes and internal improvements
   - minor for backward-compatible features
   - major for breaking changes

3. Commit the generated `.changeset/*.md` file with the code change.
4. Merge the feature branch to `main`.
5. The `Release` workflow opens or updates a `chore: version packages` PR.
6. Review and merge that version PR.
7. The next `Release` workflow run publishes the new package versions and creates GitHub Releases.
