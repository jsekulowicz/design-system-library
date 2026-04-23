import { DsBarChart } from './bar-chart.js';

if (!customElements.get('ds-bar-chart')) {
  customElements.define('ds-bar-chart', DsBarChart);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-bar-chart': DsBarChart;
  }
}
