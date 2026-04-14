import { isBrowser } from './utils/env.js';
const THEME_ATTR = 'data-ds-theme';
function readRootTheme() {
    if (!isBrowser) {
        return 'auto';
    }
    const attr = document.documentElement.getAttribute(THEME_ATTR);
    if (attr === 'light' || attr === 'dark') {
        return attr;
    }
    return 'auto';
}
export class ThemeController {
    #host;
    #observer;
    #mediaQuery;
    constructor(host) {
        this.#observer = null;
        this.#mediaQuery = null;
        this.theme = 'auto';
        this.#onPreferenceChange = () => {
            if (this.theme === 'auto') {
                this.#host.requestUpdate();
            }
        };
        this.#host = host;
        host.addController(this);
    }
    hostConnected() {
        if (!isBrowser) {
            return;
        }
        this.theme = readRootTheme();
        this.#observer = new MutationObserver(() => {
            const next = readRootTheme();
            if (next !== this.theme) {
                this.theme = next;
                this.#host.requestUpdate();
            }
        });
        this.#observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [THEME_ATTR],
        });
        this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.#mediaQuery.addEventListener('change', this.#onPreferenceChange);
    }
    hostDisconnected() {
        this.#observer?.disconnect();
        this.#mediaQuery?.removeEventListener('change', this.#onPreferenceChange);
    }
    #onPreferenceChange;
}
//# sourceMappingURL=theme-controller.js.map