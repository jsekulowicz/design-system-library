# Conventions

House rules for this repo. Most are enforced by ESLint, Prettier or `tsc`; the rest are here
because a tool cannot check them.

## Formatting

Prettier owns formatting. `.prettierrc.json` is the single source of truth — `printWidth` 120,
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

Every component needs a matching `exports` entry in `packages/components/package.json` — both
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
- No `protected` — nothing in this library is designed for subclassing outside the package.

## Lit templates

- **Optional attributes use `ifDefined`**, never `?? nothing`:

  ```ts
  role=${ifDefined(this.roleAttr)}          // yes
  role=${this.roleAttr ?? nothing}          // no
  ```

  `nothing` in an attribute binding puts `Symbol(undefined)` into the bound type, which
  `no-incompatible-type-binding` rejects and which hides real type errors from the analyzer.
  `nothing` in **child** position (`${cond ? html`…` : nothing}`) is correct and stays.

- Properties forwarded to a typed attribute must use a typed union, not `string`. `ds-core`
  exports `AriaRole`, `AriaBoolean`, `AriaChecked`, `AriaInvalid`, `AriaHasPopup`, `LinkTarget`
  and `AutocompleteToken` for this. `AutocompleteToken` is deliberately narrower than lib.dom's
  `AutoFill`, which the lit analyzers reject as too wide.

- Events are named `ds-*` and emitted through `this.emit()` from `DsElement`.

- Every component class carries a JSDoc block with `@tag` and `@summary`, plus `@slot`,
  `@csspart`, `@cssprop` and `@event` as applicable. These are not decoration — they generate
  `custom-elements.json`, the Storybook API tables and the React wrappers. One terse line each.

## Comments

Only for _why_. If a comment explains what a name means, rename the symbol; if it explains what a
block does, extract a function. Keep the ones that record a browser quirk, a spec constraint or a
deliberate trade-off, and keep them to one line.

No comments in CSS. Load-bearing constraints belong in the component's `@cssprop`/`@csspart`
JSDoc, where consumers actually read them.

## Shared code

Reach for `packages/components/src/shared/` before writing a second copy:

| Module                      | Use for                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| `slots.ts`                  | slot content detection — `hasAssignedContent`, `hasNamedSlotContent` |
| `roving-focus.ts`           | arrow/Home/End index resolution for roving-tabindex widgets          |
| `scroll-fade-controller.ts` | scroll-driven edge fades                                             |
| `form-field.ts`             | label/description/error rendering for form controls                  |
| `chart-a11y.ts`             | chart keyboard and screen-reader affordances                         |

`resolveRovingTarget` does not cover the select dropdown: `dropdown-keydown.ts` interleaves
typeahead with open/close state and stays separate on purpose.

## Linting the templates

`pnpm lint:lit` (eslint-plugin-lit) and `pnpm lint:lit:analyzer` both run in CI. The analyzer CLI
takes globs rather than a project, so it builds its own program and **type-dependent rules see
`any`** — it catches template and CSS syntax, not binding types. Binding types are checked in the
editor by `ts-lit-plugin`, registered in each package's tsconfig.
