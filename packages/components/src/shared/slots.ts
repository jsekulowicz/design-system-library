export function hasAssignedContent(slot: HTMLSlotElement): boolean {
  const nodes = slot.assignedNodes({ flatten: true });
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }
    return false;
  });
}

export function findRenderedSlot(host: HTMLElement, name: string): HTMLSlotElement | null {
  const root = host.shadowRoot;
  if (!root) {
    return null;
  }
  const selector = name === '' ? 'slot:not([name])' : `slot[name="${CSS.escape(name)}"]`;
  return root.querySelector<HTMLSlotElement>(selector);
}

function isLightChildForSlot(node: Node, name: string): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return name === '' && (node.textContent ?? '').trim().length > 0;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as Element).slot === name;
  }
  return false;
}

function hasLightChildForUnrenderedSlot(host: HTMLElement, name: string): boolean {
  return Array.from(host.childNodes).some((node) => isLightChildForSlot(node, name));
}

export function hasNamedSlotContent(host: HTMLElement, name: string, slot?: HTMLSlotElement | null): boolean {
  const target = slot ?? findRenderedSlot(host, name);
  if (target) {
    return hasAssignedContent(target);
  }
  return hasLightChildForUnrenderedSlot(host, name);
}
