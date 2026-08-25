import { defineCustomElement } from '../../registration.js';
import '../../feedback/skeleton/define.js';
import { DsStatTile } from './stat-tile.js';

defineCustomElement('ds-stat-tile', DsStatTile);

declare global {
  interface HTMLElementTagNameMap {
    'ds-stat-tile': DsStatTile;
  }
}
