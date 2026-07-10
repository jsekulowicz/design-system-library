let counter = 0;

export function nextId(prefix = 'ds'): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}`;
}
