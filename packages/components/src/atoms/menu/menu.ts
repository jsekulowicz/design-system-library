import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@ds/core';
import { menuStyles } from './menu.styles.js';
import type { DsMenuItem } from './menu-item.js';

const TYPEAHEAD_TIMEOUT_MS = 500;

/**
 * @tag ds-menu
 * @summary WAI-ARIA Menu container that owns keyboard navigation among `ds-menu-item` children.
 * @slot header - Optional region rendered above the items. Not part of the menu's role tree.
 * @slot default - `ds-menu-item` children.
 * @slot footer - Optional region rendered below the items. Not part of the menu's role tree.
 * @csspart menu - The internal `role="menu"` container that holds the items.
 * @event ds-select - Fires when an item is activated. Detail: `{ value, originalEvent }`.
 */
export class DsMenu extends DsElement {
  static override styles = [...DsElement.styles, menuStyles];

  @property() label = '';

  @state() private _hasHeader = false;
  @state() private _hasFooter = false;

  #typeaheadBuffer = '';
  #typeaheadTimer = 0;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearTypeaheadTimer();
  }

  #items(): DsMenuItem[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    if (!slot) return [];
    return slot
      .assignedElements({ flatten: true })
      .filter((el): el is DsMenuItem => el.tagName.toLowerCase() === 'ds-menu-item');
  }

  #enabledItems(): DsMenuItem[] {
    return this.#items().filter((item) => !item.disabled);
  }

  #setRovingTabindex(activeItem: DsMenuItem | null): void {
    for (const item of this.#enabledItems()) {
      item.setAttribute('tabindex', item === activeItem ? '0' : '-1');
    }
  }

  #onItemsSlotChange = (): void => {
    const enabled = this.#enabledItems();
    if (enabled.length === 0) return;
    const hasActive = enabled.some((item) => item.getAttribute('tabindex') === '0');
    if (!hasActive) this.#setRovingTabindex(enabled[0] ?? null);
  };

  #onHeaderSlotChange = (event: Event): void => {
    this._hasHeader = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  #onFooterSlotChange = (event: Event): void => {
    this._hasFooter = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  #onFocusIn = (event: FocusEvent): void => {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() !== 'ds-menu-item') return;
    if ((target as DsMenuItem).disabled) return;
    this.#setRovingTabindex(target as DsMenuItem);
  };

  #onActivate = (event: Event): void => {
    const detail = (event as CustomEvent<{ value: string; originalEvent: Event }>).detail;
    this.emit('ds-select', { detail });
  };

  #moveFocus = (direction: 1 | -1): void => {
    const items = this.#enabledItems();
    if (items.length === 0) return;
    const current = items.findIndex((item) => item.getAttribute('tabindex') === '0');
    const start = current >= 0 ? current : 0;
    const next = (start + direction + items.length) % items.length;
    items[next]?.focus();
  };

  #onKeydown = (event: KeyboardEvent): void => {
    const items = this.#enabledItems();
    if (items.length === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.#moveFocus(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.#moveFocus(-1);
        return;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        return;
      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        return;
      case 'Tab':
      case 'Escape':
      case 'Enter':
      case ' ':
        return;
    }
    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      this.#typeahead(event.key);
    }
  };

  #typeahead = (char: string): void => {
    this.#typeaheadBuffer += char.toLowerCase();
    this.#clearTypeaheadTimer();
    this.#typeaheadTimer = window.setTimeout(() => {
      this.#typeaheadBuffer = '';
    }, TYPEAHEAD_TIMEOUT_MS);
    const items = this.#enabledItems();
    const match = items.find((item) =>
      item.primaryText.toLowerCase().startsWith(this.#typeaheadBuffer),
    );
    match?.focus();
  };

  #clearTypeaheadTimer(): void {
    if (this.#typeaheadTimer) {
      window.clearTimeout(this.#typeaheadTimer);
      this.#typeaheadTimer = 0;
    }
  }

  override render(): TemplateResult {
    return html`<div class="header" ?hidden=${!this._hasHeader}>
        <slot name="header" @slotchange=${this.#onHeaderSlotChange}></slot>
      </div>
      <div
        class="items"
        part="menu"
        role="menu"
        aria-orientation="vertical"
        aria-label=${ifDefined(this.label || undefined)}
        @focusin=${this.#onFocusIn}
        @keydown=${this.#onKeydown}
        @ds-activate=${this.#onActivate}
      >
        <slot @slotchange=${this.#onItemsSlotChange}></slot>
      </div>
      <div class="footer" ?hidden=${!this._hasFooter}>
        <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
      </div>`;
  }
}
