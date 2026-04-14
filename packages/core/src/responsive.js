import { isBrowser } from './utils/env.js';
const ORDER = ['xs', 'sm', 'md', 'lg', 'xl'];
const WIDTHS = {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
};
function match(width) {
    let current = 'xs';
    for (const name of ORDER) {
        if (width >= WIDTHS[name]) {
            current = name;
        }
    }
    return current;
}
export class ContainerSizeController {
    #host;
    #observer;
    constructor(host) {
        this.#observer = null;
        this.size = 'xs';
        this.#host = host;
        host.addController(this);
    }
    hostConnected() {
        if (!isBrowser || typeof ResizeObserver === 'undefined') {
            return;
        }
        this.#observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) {
                return;
            }
            const next = match(entry.contentRect.width);
            if (next !== this.size) {
                this.size = next;
                this.#host.requestUpdate();
            }
        });
        this.#observer.observe(this.#host);
    }
    hostDisconnected() {
        this.#observer?.disconnect();
    }
}
//# sourceMappingURL=responsive.js.map