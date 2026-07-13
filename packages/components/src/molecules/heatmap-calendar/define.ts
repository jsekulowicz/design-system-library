import { DsHeatmapCalendar } from './heatmap-calendar.js';

if (!customElements.get('ds-heatmap-calendar')) {
  customElements.define('ds-heatmap-calendar', DsHeatmapCalendar);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-heatmap-calendar': DsHeatmapCalendar;
  }
}
