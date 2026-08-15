# Conventions

House rules for this repo. Most are enforced by ESLint, Prettier or `tsc`; the rest are here
because a tool cannot check them.

## Formatting

Prettier owns formatting. `.prettierrc.json` is the single source of truth - `printWidth` 120,
single quotes, trailing commas. `pnpm format:check` gates CI.

The repo ships `.vscode/settings.json` pinning Prettier as the formatter for every language it
handles. Without it, VS Code's built-in TypeScript formatter takes over `.ts` files and produces
diffs that fail CI (`void {}` becomes `void { }`).

`.git-blame-ignore-revs` lists the wholesale reformat commit. Wire it up once:

```sh
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Files per component

```
button/
  button.ts             the element class
  button.styles.ts      `css` tagged template, exported as `<name>Styles`
  button.test.ts        vitest + @open-wc/testing
  define.ts             guarded customElements.define + HTMLElementTagNameMap
  index.ts              re-exports the class and its public types
```

Every component needs a matching `exports` entry in `packages/components/package.json` - both
`./<name>` and `./<name>/define`. Prefer splitting a file over letting it pass ~150 lines.

## TypeScript

- `function` for module-level functions, not `const x = () => {}`.
- `interface` over `type` for object shapes (`consistent-type-definitions`).
- `import type` for type-only imports (`consistent-type-imports`).
- Braces on every `if`, always on their own line (`curly`). No single-line `if (x) return;`.

## Class members

- `#private` by default.
- `private _name` **only** where a decorator forces it: `@state` and `@query` cannot decorate a
  `#private` field under `experimentalDecorators`. The leading underscore is required there
  (`naming-convention`), so the two forms stay visually distinct.
- No `protected` - nothing in this library is designed for subclassing outside the package.

## Lit templates

- **Optional attributes use `ifDefined`**, never `?? nothing`:

  ```ts
  role=${ifDefined(this.roleAttr)}          // yes
  role=${this.roleAttr ?? nothing}          // no
  ```

  `nothing` in an attribute binding puts `Symbol(undefined)` into the bound type, which
  `no-incompatible-type-binding` rejects and which hides real type errors from the analyzer.
  `nothing` in **child** position (`${cond ? html`...` : nothing}`) is correct and stays.

- Properties forwarded to a typed attribute must use a typed union, not `string`. `ds-core`
  exports `AriaRole`, `AriaBoolean`, `AriaChecked`, `AriaInvalid`, `AriaHasPopup`, `LinkTarget`
  and `AutocompleteToken` for this. `AutocompleteToken` is deliberately narrower than lib.dom's
  `AutoFill`, which the lit analyzers reject as too wide.

- Events are named `ds-*` and emitted through `this.emit()` from `DsElement`.

- Every component class carries a JSDoc block with `@tag` and `@summary`, plus `@slot`,
  `@csspart`, `@cssprop` and `@event` as applicable. These are not decoration - they generate
  `custom-elements.json`, the Storybook API tables and the React wrappers. One terse line each.

## Comments

**Don't write them.** Put the explanation in a name instead — of the symbol, the extracted
function, or the test. A name travels with the code, survives a move between files, and cannot
drift out of date the way a comment can.

This applies to the _why_ comments too, which is the part people get wrong. A trade-off worth
recording is worth naming:

```ts
// no
// Overlay, not a flex item: inline space would resize the button on load.
function plainContent(loading: boolean) { … }

// yes
function contentWithSpinnerOverlaidOnTop(loading: boolean) { … }
```

The name is longer than a typical one, and that is the point: it states the constraint at every
call site rather than only where the function is declared. Reach for the same move with a named
constant, a named watcher callback, or a test whose title _is_ the scenario:

```ts
it('exposes exactly one focusable element so the link is a single tab stop', …)
```

What genuinely cannot be named — a browser bug with an issue number, a spec citation — belongs in
the component's `@tag`/`@attr`/`@cssprop`/`@csspart` JSDoc, which consumers actually read and which
`custom-elements.json` publishes. Anything about _this release_ rather than _this code_ belongs in
the changeset.

No comments in CSS, ever.

## Shared code

Reach for `packages/components/src/shared/` before writing a second copy:

| Module                      | Use for                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| `slot-presence.ts`          | reactive "is this slot filled?" state - the default for `_hasX` flags |
| `slots.ts`                  | the underlying predicates, when a controller is overkill              |
| `modal-surface.ts`          | the native `<dialog>` lifecycle shared by `ds-dialog` / `ds-drawer`   |
| `roving-focus.ts`           | arrow/Home/End index resolution for roving-tabindex widgets           |
| `scroll-fade-controller.ts` | scroll-driven edge fades                                              |
| `form-field.ts`             | label/description/error rendering for form controls                   |
| `chart-a11y.ts`             | chart keyboard and screen-reader affordances                          |

Deliberate exceptions, so nobody "fixes" them into the shared helper:

- **`ds-tabs`** does not use `resolveRovingTarget`. Arrowing onto a disabled tab is a no-op here,
  not a skip, and its tests assert that. The shared helper skips disabled entries.
- **`dropdown-keydown.ts`** (select) interleaves typeahead with open/close state.
- **`ds-table`** derives slot presence from light-DOM queries during update, not `slotchange`.
- The **charts** share `chart-a11y.ts` but keep their own key handling: heatmap navigates a 2D
  grid, bar-chart walks grouped/stacked series, pie is 1D. Only the two `@state` fields look
  alike.

## Do not remove the react-dom devDependencies

`packages/react` and `packages/storybook` both declare `react-dom` as a devDependency even though
neither imports it. knip is configured to ignore them, and they must stay.

`@jsekulowicz/ds-react` declares `react-dom: ">=18"` as a **peer**. With nothing pinning it, pnpm
satisfies that range with react-dom 18 and pairs it against react 19
(`react-dom@18.3.1_react@19.2.8`). React 19 removed the `ReactCurrentBatchConfig` internal that
react-dom 18 reads, so Storybook's preview throws on load, no custom element upgrades, and every
e2e and a11y test times out waiting for elements that never render.

It reproduces only from a clean `--frozen-lockfile` install, which is what CI does - a local
`node_modules` that has drifted through incremental installs will happily keep working. Reproduce
with `scripts/visual-docker.sh test:e2e`.

## TypeScript version

Pinned at **6.0.3** across every workspace. TypeScript 7 (the native compiler) was tried and
rolled back - two blockers, both in tools that consume the compiler API:

- `typescript-eslint@8.66.0` declares `>=4.8.4 <6.1.0` and **errors out** on TS 7 rather than
  warning, so every `pnpm lint` fails.
- `lit-analyzer@2.0.3` crashes on require, so `pnpm lint:lit:analyzer` fails.

The compiler itself is fine: build, declaration emit under `experimentalDecorators` +
`useDefineForClassFields: false`, typecheck and all unit tests pass on 7.0.2. Retry once both
tools ship TS 7 support.

TS 6 no longer picks up `@types` packages from an ancestor `node_modules`. A workspace that uses
node builtins needs its own `@types/node` **and** an explicit `"types": ["node"]` - see
`packages/tokens/tsconfig.json`.

## Linting the templates

`pnpm lint:lit` (eslint-plugin-lit) and `pnpm lint:lit:analyzer` both run in CI. The analyzer CLI
takes globs rather than a project, so it builds its own program and **type-dependent rules see
`any`** - it catches template and CSS syntax, not binding types. Binding types are checked in the
editor by `ts-lit-plugin`, registered in each package's tsconfig.
