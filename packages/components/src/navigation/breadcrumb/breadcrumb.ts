import { html, type TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { breadcrumbStyles } from './breadcrumb.styles.js';
import type { DsBreadcrumbItem } from './breadcrumb-item.js';

/**
 * @tag ds-breadcrumb
 * @summary Navigational trail of ancestor pages. Marks the last slotted item as the current page.
 * @slot default - `ds-breadcrumb-item` children in ancestor-to-current order.
 * @slot trailing - Controls that belong beside the current crumb. They join the trail's own
 * flex row, so they follow the last crumb onto whichever line it wraps to.
 * @csspart nav - The internal `<nav>` element.
 * @csspart list - The ordered `<ol>` list.
 * @csspart trailing - The wrapper around the trailing slot.
 */
export class DsBreadcrumb extends DsElement {
  static override styles = [...DsElement.styles, breadcrumbStyles];

  @property() label = 'Breadcrumb';

  @queryAssignedElements({ selector: 'ds-breadcrumb-item' })
  private _items!: DsBreadcrumbItem[];

  #sync = (): void => {
    const items = this._items;
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      item.toggleAttribute('last', isLast);
      item.toggleAttribute('current', isLast);
    });
  };

  override render(): TemplateResult {
    return html`
      <nav part="nav" aria-label=${this.label}>
        <ol part="list" role="list">
          <slot @slotchange=${this.#sync}></slot>
          <span part="trailing" role="none"><slot name="trailing"></slot></span>
        </ol>
      </nav>
    `;
  }
}
