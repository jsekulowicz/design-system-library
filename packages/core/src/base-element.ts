import { LitElement } from 'lit';
import { resetStyles, focusVisibleStyles, reducedMotionStyles } from './reset-styles.js';
import { emit, type DsEventOptions } from './utils/event.js';
import { nextId } from './utils/id.js';

export class DsElement extends LitElement {
  static override styles = [resetStyles, focusVisibleStyles, reducedMotionStyles];

  readonly uid: string = nextId(this.localName || 'ds');

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('data-ds')) {
      this.setAttribute('data-ds', '');
    }
  }

  protected emit<T>(name: string, options: DsEventOptions<T>): boolean {
    return emit<T>(this, name, options);
  }
}
