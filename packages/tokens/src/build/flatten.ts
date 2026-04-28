export type TokenTree = { [key: string]: string | number | TokenTree };
export type FlatTokens = Record<string, string>;

function kebab(key: string): string {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\./g, '-')
    .toLowerCase();
}

export function flatten(tree: TokenTree, prefix = '--ds'): FlatTokens {
  const out: FlatTokens = {};
  for (const [rawKey, value] of Object.entries(tree)) {
    const key = kebab(rawKey);
    const path = `${prefix}-${key}`;
    if (value !== null && typeof value === 'object') {
      Object.assign(out, flatten(value as TokenTree, path));
    } else {
      out[path] = String(value);
    }
  }
  return out;
}
