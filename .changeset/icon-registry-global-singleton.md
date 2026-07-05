---
"@jsekulowicz/ds-components": patch
---

`ds-icon`: anchor the icon registry on `globalThis` (keyed by `Symbol.for`) so duplicate copies of the module share one registry. Previously a per-module `Map` could let icon registrations land in a copy that `<ds-icon>` never read — surfacing intermittently (e.g. around Vite dep re-optimization) as `unknown icon "…"` warnings and blank icons.
