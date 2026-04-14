import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { isBrowser } from './utils/env.js';

export type Theme = 'light' | 'dark' | 'auto';

const THEME_ATTR = 'data-ds-theme';

function readRootTheme(): Theme {
  if (!isBrowser) {
    return 'auto';
  }
  const attr = document.documentElement.getAttribute(THEME_ATTR);
  if (attr === 'light' || attr === 'dark') {
    return attr;
  }
  return 'auto';
}

export class ThemeController implements ReactiveController {
  #host: ReactiveControllerHost;
  #observer: MutationObserver | null = null;
  #mediaQuery: MediaQueryList | null = null;
  theme: Theme = 'auto';

  constructor(host: ReactiveControllerHost) {
    this.#host = host;
    host.addController(this);
  }

  hostConnected(): void {
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

  hostDisconnected(): void {
    this.#observer?.disconnect();
    this.#mediaQuery?.removeEventListener('change', this.#onPreferenceChange);
  }

  #onPreferenceChange = (): void => {
    if (this.theme === 'auto') {
      this.#host.requestUpdate();
    }
  };
}
