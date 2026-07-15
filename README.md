# Design System Library

A framework-agnostic design system built on **Lit** web components, organized by **atomic design**, themeable via a three-tier token layer, responsive by default, tree-shakable (JS and CSS), and accessible to WCAG 2.2 AA.

Live Storybook docs: https://jsekulowicz.github.io/design-system-library

## Packages

| Package                                               | Description                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`@jsekulowicz/ds-tokens`](./packages/tokens)         | Design tokens (primitive + semantic layers) + generated CSS themes                |
| [`@jsekulowicz/ds-core`](./packages/core)             | `DsElement` base class, `FormControlMixin` (ElementInternals), controllers, utils |
| [`@jsekulowicz/ds-components`](./packages/components) | Web components (atoms → molecules → organisms → templates → pages)                |
| [`@jsekulowicz/ds-react`](./packages/react)           | Thin React wrappers generated from the Custom Elements Manifest via `@lit/react`  |
| [`@ds/storybook`](./packages/storybook)               | Storybook docs site (live examples, API tables, design intent, foundations)       |

## Components

**Atoms** — `ds-badge`, `ds-breadcrumb`, `ds-button`, `ds-checkbox`, `ds-checkbox-group`, `ds-icon`, `ds-link`, `ds-nav-item`, `ds-nav-group`, `ds-radio`, `ds-radio-group`, `ds-searchable-select`, `ds-select`, `ds-skeleton`, `ds-table`, `ds-tabs`, `ds-text-field`, `ds-tooltip`

**Molecules** — `ds-alert`, `ds-bar-chart`, `ds-card`, `ds-field`, `ds-stat-tile`

**Organisms** — `ds-footer`, `ds-form`, `ds-navbar`, `ds-sidenav`

**Templates** — `ds-page-shell`

**Pages** — `ds-settings-page`

## Getting started

```sh
pnpm install
pnpm build          # build all packages
pnpm dev            # start Storybook with watch mode
pnpm test           # Vitest unit tests across all packages
pnpm test:e2e       # Playwright end-to-end tests
pnpm test:a11y      # axe-core accessibility tests against every story
pnpm lint           # ESLint + Stylelint across all packages
pnpm typecheck      # TypeScript type-check across all packages
```

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
<ds-button variant="primary">Save</ds-button>
<ds-text-field label="Email" type="email"></ds-text-field>
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
