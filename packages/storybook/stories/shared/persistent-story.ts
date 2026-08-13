import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';

class PersistentStory extends LitElement {
  @property({ attribute: false }) renderContent?: () => TemplateResult;
  @state() private version = 0;

  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  private restoreContent = (): void => {
    this.version += 1;
  };

  override render(): TemplateResult {
    const content = this.renderContent ? keyed(this.version, this.renderContent()) : nothing;
    return html`<div @ds-dismiss=${this.restoreContent}>${content}</div>`;
  }
}

if (!customElements.get('ds-story-persistent')) {
  customElements.define('ds-story-persistent', PersistentStory);
}

export function persistentStory(renderContent: () => TemplateResult): TemplateResult {
  return html`<ds-story-persistent .renderContent=${renderContent}></ds-story-persistent>`;
}
