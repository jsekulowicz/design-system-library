import { defineCustomElement } from '../../registration.js';
import '../../atoms/skeleton/define.js';
import { DsPieChart } from './pie-chart.js';

defineCustomElement('ds-pie-chart', DsPieChart);

declare global {
  interface HTMLElementTagNameMap {
    'ds-pie-chart': DsPieChart;
  }
}
