---
'@jsekulowicz/ds-components': minor
---

**Breaking:** `ds-checkbox` and `ds-radio` take their value as `checkbox-value`
and `radio-value`. They previously answered only to `checkboxvalue` and
`radiovalue` - Lit derives an attribute by lowercasing the property name, and
those two were the last places relying on it rather than declaring the name.

Rename the attributes where you set them in markup:

```diff
-<ds-checkbox checkboxvalue="email">Email</ds-checkbox>
+<ds-checkbox checkbox-value="email">Email</ds-checkbox>
-<ds-radio radiovalue="monthly">Monthly</ds-radio>
+<ds-radio radio-value="monthly">Monthly</ds-radio>
```

Nothing changes if you set the `checkboxValue` / `radioValue` property, which
is what the React wrappers and any `.prop=` binding already do.
