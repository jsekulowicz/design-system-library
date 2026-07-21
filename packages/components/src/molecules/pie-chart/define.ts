import { DsPieChart } from './pie-chart.js';

if (!customElements.get('ds-pie-chart')) {
  customElements.define('ds-pie-chart', DsPieChart);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-pie-chart': DsPieChart;
  }
}
