import { defineCustomElement } from '../../registration.js';
import '../../atoms/skeleton/define.js';
import { DsHeatmapCalendar } from './heatmap-calendar.js';

defineCustomElement('ds-heatmap-calendar', DsHeatmapCalendar);

declare global {
  interface HTMLElementTagNameMap {
    'ds-heatmap-calendar': DsHeatmapCalendar;
  }
}
