import { DsStatTile } from './stat-tile.js';

if (!customElements.get('ds-stat-tile')) {
  customElements.define('ds-stat-tile', DsStatTile);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-stat-tile': DsStatTile;
  }
}
