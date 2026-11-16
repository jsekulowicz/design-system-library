let counter = 0;

export function createId(prefix = 'ds'): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}`;
}
