import { LitElement } from 'lit';
import { type DsEventOptions } from './utils/event.js';
export declare class DsElement extends LitElement {
    static styles: import("lit").CSSResult[];
    readonly uid: string;
    connectedCallback(): void;
    protected emit<T>(name: string, options: DsEventOptions<T>): boolean;
}
//# sourceMappingURL=base-element.d.ts.map