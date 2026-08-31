---
'@jsekulowicz/ds-components': minor
---

Let every component be translated. `ds-table-pagination` was the first, but the same gap ran through the library: strings a component renders on its own behalf were English literals with no way past them. A page translated everywhere else still announced itself in English to a screen reader, and printed English on screen in the chart screen-reader tables, the heatmap legend, the pie chart's empty state and the color picker's panel. The charts also declared their `aria-roledescription` in English, which a screen reader announces in place of the role itself.

New properties, each defaulting to what the component rendered before:

- `ds-dialog`, `ds-drawer`: `close-label`
- `ds-alert`, `ds-toast`: `dismiss-label`
- `ds-select`, `ds-searchable-select`: `remove-label`, `overflow-label`, `clear-label`
- `ds-color-picker`: `picker-label`, `compact-label`, `hex-label`, `hex-placeholder`, `clear-label`, `done-label`, `custom-label`
- `ds-table-sort-button`: `sort-label`, `sort-by-label`, `ascending-label`, `descending-label`
- `ds-page-shell`: `collapse-aside-label`, `expand-aside-label`, `hide-aside-end-label`, `show-aside-end-label`
- `ds-settings-page`: `sections-label`
- `ds-pie-chart`: `chart-label`, `donut-label`, `data-table-label`, `summary-label`, `empty-label`, `category-header`, `value-header`, `share-header`, `total-header`, `role-description`
- `ds-bar-chart`: `chart-label`, `data-table-label`, `summary-label`, `stacked-summary-label`, `group-total-label`, `total-header`, `role-description`
- `ds-heatmap-calendar`: `calendar-label`, `data-table-label`, `summary-label`, `legend-label`, `legend-less-label`, `legend-more-label`, `date-header`, `value-header`, `role-description`

The ones that carry values interpolate named placeholders - `{label}`, `{count}`, `{column}`, `{name}`, `{title}`, `{slices}`, `{groups}`, `{series}`, `{days}`, `{total}` - and a placeholder a component does not recognize is left in place rather than printed as `undefined`.

Nothing changes for consumers who set none of them, with one exception: a donut chart with no `title` now announces itself as "Donut chart" rather than "Pie chart", matching what its own summary already said.
