type DsRegistrationGlobal = typeof globalThis & {
  __DS_DEFER_CUSTOM_ELEMENTS__?: boolean;
};

interface PendingDefinition {
  constructor: CustomElementConstructor;
  options?: ElementDefinitionOptions;
}

const dsGlobal = globalThis as DsRegistrationGlobal;
const pendingDefinitions = new Map<string, PendingDefinition>();

export function defineCustomElement(
  name: string,
  constructor: CustomElementConstructor,
  options?: ElementDefinitionOptions,
): void {
  if (customElements.get(name)) {
    return;
  }

  if (dsGlobal.__DS_DEFER_CUSTOM_ELEMENTS__) {
    if (!pendingDefinitions.has(name)) {
      pendingDefinitions.set(name, { constructor, options });
    }
    return;
  }

  customElements.define(name, constructor, options);
}

export function flushCustomElementDefinitions(): void {
  dsGlobal.__DS_DEFER_CUSTOM_ELEMENTS__ = false;

  for (const [name, { constructor, options }] of pendingDefinitions) {
    if (!customElements.get(name)) {
      customElements.define(name, constructor, options);
    }
  }

  pendingDefinitions.clear();
}
