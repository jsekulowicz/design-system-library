import { html, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { settingsPageStyles } from './settings-page.styles.js';

export interface SettingsSection {
  id: string;
  label: string;
}

/**
 * @tag ds-settings-page
 * @summary Composition example — settings page with sticky nav and slotted sections.
 * @slot default - One or more `<section id="...">` blocks matching the nav items.
 */
export class DsSettingsPage extends DsElement {
  static override styles = [...DsElement.styles, settingsPageStyles];

  @property() heading = 'Settings';
  @property() description = '';
  @property({ type: Array }) sections: SettingsSection[] = [];
  @state() private activeId = '';

  #escapeId(value: string): string {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return value.replaceAll('"', '\\"');
  }

  #scrollTo = (id: string) => (event: MouseEvent) => {
    event.preventDefault();
    this.activeId = id;
    const target = document.getElementById(id) ?? this.querySelector(`#${this.#escapeId(id)}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  override render(): TemplateResult {
    const current = this.activeId || this.sections[0]?.id || '';
    const hasNav = this.sections.length > 0;
    return html`<header class="hero" part="hero">
        <h1 part="heading">${this.heading}</h1>
        ${this.description ? html`<p>${this.description}</p>` : null}
      </header>
      ${hasNav
        ? html`<div class="grid">
            <nav aria-label="Settings sections" part="nav">
              ${this.sections.map(
                (section) =>
                  html`<a
                    href=${`#${section.id}`}
                    aria-current=${section.id === current ? 'true' : 'false'}
                    @click=${this.#scrollTo(section.id)}
                    >${section.label}</a
                  >`,
              )}
            </nav>
            <div class="sections" part="sections"><slot></slot></div>
          </div>`
        : html`<div class="sections" part="sections"><slot></slot></div>`}`;
  }
}
