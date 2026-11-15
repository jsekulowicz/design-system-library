---
'@jsekulowicz/ds-components': minor
---

`ds-heatmap-calendar` keeps the tooltip of a clicked or focused day after the pointer leaves the calendar, until focus moves away, another day takes it or Escape hides it. Escape hides a tooltip shown by hover or focus and leaves focus on the day, and clicking that day shows it again; once no tooltip shows, Escape is left to the page. The arrow keys and Tab follow the focused day, not the hovered one, and the focused day keeps its stroke while the pointer shows another. A clicked day gets that stroke instead of the browser's focus outline, and the stroke of the last week and the last weekday is no longer cut off. The tooltip is left-aligned, with the value at the large body size and the date and details at the medium one, and up to 18rem wide so a detail fits on one line. `--ds-heatmap-cell-radius` sets the corner radius of the day and legend cells.
