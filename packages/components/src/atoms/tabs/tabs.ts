import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tabsStyles } from './tabs.styles.js';
import type { DsTab } from './tab.js';
import type { DsTabPanel } from './tab-panel.js';

/**
 * @tag ds-tabs
 * @summary Tablist container that coordinates ds-tab triggers and ds-tab-panel regions.
 * @slot tab - ds-tab elements that make up the tablist.
 * @slot default - ds-tab-panel elements, one per tab.
 * @event ds-change - Fires when the active tab changes. Detail: `{ value: string }`.
 * @csspart tablist - The horizontal tab row.
 * @csspart panels - The panels container.
 */
export class DsTabs extends DsElement {
  static override styles = [...DsElement.styles, tabsStyles];

  @property() value = '';

  @queryAssignedElements({ slot: 'tab', selector: 'ds-tab' }) private _tabs!: DsTab[];
  @queryAssignedElements({ selector: 'ds-tab-panel' }) private _panels!: DsTabPanel[];

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('ds-tab-activate', this.#onTabActivate as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('ds-tab-activate', this.#onTabActivate as EventListener);
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('value')) {
      this.#syncSelection();
    }
  }

  #onSlotChange = (): void => {
    if (!this.value && this._tabs[0]) {
      this.value = this._tabs[0].value;
    }
    this.#syncSelection();
  };

  #syncSelection = (): void => {
    this._tabs.forEach(tab => {
      const selected = !tab.disabled && tab.value === this.value;
      tab.selected = selected;
      tab.tabIndex = selected ? 0 : -1;
      tab.id = `${this.uid}-tab-${tab.value}`;
      tab.setAttribute('aria-controls', `${this.uid}-panel-${tab.value}`);
    });
    this._panels.forEach(panel => {
      panel.active = panel.value === this.value;
      panel.id = `${this.uid}-panel-${panel.value}`;
      panel.setAttribute('aria-labelledby', `${this.uid}-tab-${panel.value}`);
    });
  };

  #onTabActivate = (event: CustomEvent<{ value: string }>): void => {
    event.stopPropagation();
    this.#setValue(event.detail.value);
  };

  #setValue = (value: string): void => {
    if (value === this.value) {
      return;
    }
    this.value = value;
    this.emit('ds-change', { detail: { value } });
  };

  #focusTab = (index: number): void => {
    const tab = this._tabs[index];
    if (!tab || tab.disabled) {
      return;
    }
    tab.focus();
    this.#setValue(tab.value);
  };

  #onKeydown = (event: KeyboardEvent): void => {
    const count = this._tabs.length;
    if (count === 0) {
      return;
    }
    const current = this._tabs.findIndex(t => t.value === this.value);
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
        next = current <= 0 ? count - 1 : current - 1;
        break;
      case 'ArrowRight':
        next = current >= count - 1 ? 0 : current + 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.#focusTab(next);
  };

  override render(): TemplateResult {
    return html`
      <div class="tablist" part="tablist" role="tablist" @keydown=${this.#onKeydown}>
        <slot name="tab" @slotchange=${this.#onSlotChange}></slot>
      </div>
      <div class="panels" part="panels">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }
}
