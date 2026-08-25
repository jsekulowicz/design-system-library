// Hoisted out of the markup because Prettier cannot wrap an attribute value.

export function joinStyles(...parts: string[]): string {
  return parts.filter(Boolean).join(';');
}

export const SECTION =
  'display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);font-size:var(--ds-font-size-body-lg);color:var(--ds-color-fg)';
export const MUTED_CELL = 'font-size:var(--ds-font-size-body-md);color:var(--ds-color-fg-muted)';
export const MONO_MUTED_CELL = joinStyles(
  'font-family:var(--ds-font-mono)',
  'font-size:var(--ds-font-size-body-md)',
  'color:var(--ds-color-fg-muted)',
);

export const GROUP_LABEL = joinStyles(
  'margin:0',
  'font-family:var(--ds-font-display)',
  'font-size:var(--ds-font-size-heading-sm)',
  'font-weight:var(--ds-font-weight-semibold)',
  'letter-spacing:var(--ds-letter-spacing-display)',
  'color:var(--ds-color-fg)',
);

export function card(padding: string): string {
  return joinStyles(
    `padding:${padding}`,
    'border:1px solid var(--ds-color-border)',
    'border-radius:var(--ds-radius-xs)',
    'display:grid;gap:var(--ds-space-3)',
  );
}

export function autoGrid(min: string): string {
  return `display:grid;grid-template-columns:repeat(auto-fit,minmax(${min},1fr));gap:var(--ds-space-4)`;
}
