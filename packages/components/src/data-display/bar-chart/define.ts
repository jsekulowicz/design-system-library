import { defineCustomElement } from '../../registration.js';
import '../../feedback/skeleton/define.js';
import { DsBarChart } from './bar-chart.js';

defineCustomElement('ds-bar-chart', DsBarChart);

declare global {
  interface HTMLElementTagNameMap {
    'ds-bar-chart': DsBarChart;
  }
}
