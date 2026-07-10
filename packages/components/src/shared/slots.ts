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

/* Falls back to inspecting light-DOM children before the slot has rendered. */
export function hasNamedSlotContent(
  host: HTMLElement,
  name: string,
  slot?: HTMLSlotElement | null,
): boolean {
  if (slot) {
    return hasAssignedContent(slot);
  }
  return Array.from(host.children).some((child) => child.slot === name);
}
