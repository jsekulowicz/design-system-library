let counter = 0;

export function nextId(prefix = 'ds'): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}`;
}

export function ensureId(element: HTMLElement, prefix = 'ds'): string {
  if (!element.id) {
    element.id = nextId(prefix);
  }
  return element.id;
}
