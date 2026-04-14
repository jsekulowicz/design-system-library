import { LitElement } from 'lit';
import { resetStyles, focusVisibleStyles, reducedMotionStyles } from './reset-styles.js';
import { emit } from './utils/event.js';
import { nextId } from './utils/id.js';
export class DsElement extends LitElement {
    constructor() {
        super(...arguments);
        this.uid = nextId(this.localName || 'ds');
    }
    static { this.styles = [resetStyles, focusVisibleStyles, reducedMotionStyles]; }
    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute('data-ds')) {
            this.setAttribute('data-ds', '');
        }
    }
    emit(name, options) {
        return emit(this, name, options);
    }
}
//# sourceMappingURL=base-element.js.map