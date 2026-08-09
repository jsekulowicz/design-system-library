import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { hasAssignedContent, hasNamedSlotContent } from './slots.js';

/** Key for the unnamed default slot. */
export const DEFAULT_SLOT = '';

export class SlotPresenceController implements ReactiveController {
  readonly #host: ReactiveControllerHost & HTMLElement;
  readonly #present = new Map<string, boolean>();

  constructor(host: ReactiveControllerHost & HTMLElement, names: readonly string[]) {
    this.#host = host;
    for (const name of names) {
      this.#present.set(name, false);
    }
    host.addController(this);
  }

  hostConnected(): void {
    for (const name of this.#present.keys()) {
      this.#set(name, hasNamedSlotContent(this.#host, name));
    }
  }

  has(name: string): boolean {
    return this.#present.get(name) ?? false;
  }

  hasAny(...names: readonly string[]): boolean {
    return names.some((name) => this.has(name));
  }

  handleSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.#set(slot.name, hasAssignedContent(slot));
  };

  #set(name: string, value: boolean): void {
    if (this.#present.get(name) === value) {
      return;
    }
    this.#present.set(name, value);
    this.#host.requestUpdate();
  }
}
