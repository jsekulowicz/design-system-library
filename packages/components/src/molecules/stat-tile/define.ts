import { defineCustomElement } from '../../registration.js';
import '../../atoms/skeleton/define.js';
import { DsStatTile } from './stat-tile.js';

defineCustomElement('ds-stat-tile', DsStatTile);

declare global {
  interface HTMLElementTagNameMap {
    'ds-stat-tile': DsStatTile;
  }
}
