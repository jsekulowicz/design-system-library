---
'@jsekulowicz/ds-components': patch
'@jsekulowicz/ds-core': minor
---

Blank anchor attributes are now omitted instead of rendered empty. `ds-breadcrumb-item` (`target`, `rel`, `download`, `hreflang`, `type`, `referrerpolicy`), `ds-nav-item` and `ds-button` (`target`, `rel`) and `ds-link` (`target`) treated an empty string as a value and passed it through, so binding an unset field produced `rel=""` on the `<a>`. They now drop the attribute, matching what an unset property already did.

One case changes behaviour rather than just markup: `download=""` on an `<a>` means "download this, deriving the filename from the URL", so a `ds-breadcrumb-item` given an empty `download` used to download and now navigates. Pass a filename, or `download` as a bare attribute on your own anchor, if you relied on it.

`@jsekulowicz/ds-core` exports the `omitWhenBlank` helper this uses.
