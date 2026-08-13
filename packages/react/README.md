# @jsekulowicz/ds-react

React wrappers for `@jsekulowicz/ds-components`, generated from the Custom Elements Manifest via
[`@lit/react`](https://lit.dev/docs/frameworks/react/).

```sh
pnpm add @jsekulowicz/ds-react react react-dom
```

```tsx
import { Button } from '@jsekulowicz/ds-react';

<Button variant="primary" onDsClick={() => save()}>
  Save
</Button>;
```

## Do you still need these wrappers?

React 19 passes unknown props to custom elements as attributes (and as properties where one
exists), so basic interop no longer needs a wrapper. What the wrappers still buy you:

- **Typed props** - `variant`, `size` and friends are checked against the component's own union
  types instead of accepted as arbitrary strings.
- **Custom events as props** - `onDsClick`, `onDsChange` and the rest. React has no built-in
  mapping from a `ds-*` CustomEvent to a prop; `@lit/react` wires the listener for you.
- **Non-serializable props** - objects and arrays are set as properties, not stringified.

On React 18 the wrappers are required for all of the above. The `peerDependencies` range is
`>=18`; both are supported.

## Generation

`src/` is generated. Do not edit it by hand:

```sh
pnpm --filter @jsekulowicz/ds-react generate
```

CI fails if the committed output does not match the generator.
