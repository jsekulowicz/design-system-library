import type { CSSResult } from 'lit';

type Styles = CSSResult | readonly CSSResult[];

function escapeForRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function toNormalizedCss(styles: Styles): string {
  const results = Array.isArray(styles) ? styles : [styles];
  return results
    .map((result: CSSResult) => result.cssText)
    .join(' ')
    .replace(/\s+/g, ' ');
}

export function getDeclarationsOf(styles: Styles, selector: string): string {
  const pattern = new RegExp(`(?:^|[{};]) ?${escapeForRegExp(selector)} \\{([^{}]*)\\}`);
  return toNormalizedCss(styles).match(pattern)?.[1] ?? '';
}
