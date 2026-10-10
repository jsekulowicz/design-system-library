---
'@jsekulowicz/ds-components': minor
'@jsekulowicz/ds-react': minor
---

Every event with a payload now publishes its detail type. Shared shapes (`ValueChangeDetail`, `ValuesChangeDetail`, `SelectionChangeDetail`, `CheckedChangeDetail`, `SearchDetail`, `OverflowClickDetail`, `ClickDetail`, `ActivateDetail`, `DialogCloseDetail`) come from the package root and the new `@jsekulowicz/ds-components/events` subpath; `StepListSelectDetail`, `ToastDismissDetail`, `FormSubmitDetail`, `NavGroupToggleDetail` and `PageShellAsideStateChangeDetail` come with their components. The React wrappers type their event props with them.
