import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { isBrowser } from './utils/env.js';

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const ORDER: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const WIDTHS: Record<BreakpointName, number> = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

function match(width: number): BreakpointName {
  let current: BreakpointName = 'xs';
  for (const name of ORDER) {
    if (width >= WIDTHS[name]) {
      current = name;
    }
  }
  return current;
}

export class ContainerSizeController implements ReactiveController {
  #host: ReactiveControllerHost & HTMLElement;
  #observer: ResizeObserver | null = null;
  size: BreakpointName = 'xs';

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    host.addController(this);
  }

  hostConnected(): void {
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

  hostDisconnected(): void {
    this.#observer?.disconnect();
  }
}
