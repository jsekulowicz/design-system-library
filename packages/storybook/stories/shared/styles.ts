// Hoisted out of the markup because Prettier cannot wrap an attribute value.

export function joinStyles(...parts: string[]): string {
  return parts.filter(Boolean).join(';');
}

function stripeRow(i: number): string {
  return i % 2 !== 0 ? 'background:color-mix(in oklab,var(--ds-color-fg) 3%,transparent)' : '';
}

export const SECTION = 'display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);color:var(--ds-color-fg)';
export const TABLE = 'display:grid;gap:0';
export const MONO_CELL = 'font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-sm)';
export const MUTED_CELL = 'font-size:var(--ds-font-size-body-sm);color:var(--ds-color-fg-muted)';
export const NUM_CELL = `font-variant-numeric:tabular-nums;${MUTED_CELL}`;
export const MONO_MUTED_CELL = joinStyles(MONO_CELL, 'color:var(--ds-color-fg-muted)');

export const GROUP_LABEL = joinStyles(
  'margin:0',
  'font-size:var(--ds-font-size-body-sm)',
  'font-weight:var(--ds-font-weight-semibold)',
  'text-transform:uppercase',
  'letter-spacing:var(--ds-letter-spacing-wide)',
  'color:var(--ds-color-fg-muted)',
);

export function headerRow(columns: string): string {
  return joinStyles(
    `display:grid;grid-template-columns:${columns}`,
    'gap:var(--ds-space-3)',
    'padding:var(--ds-space-2) var(--ds-space-2)',
    'border-bottom:1px solid var(--ds-color-border)',
  );
}

export function bodyRow(columns: string, i: number): string {
  return joinStyles(
    `display:grid;grid-template-columns:${columns}`,
    'align-items:center',
    'gap:var(--ds-space-3)',
    'padding:var(--ds-space-3) var(--ds-space-2)',
    'border-radius:var(--ds-radius-xs)',
    stripeRow(i),
  );
}

export function card(padding: string): string {
  return joinStyles(
    `padding:${padding}`,
    'border:1px solid var(--ds-color-border)',
    'border-radius:var(--ds-radius-md)',
    'display:grid;gap:var(--ds-space-3)',
  );
}

export function autoGrid(min: string): string {
  return `display:grid;grid-template-columns:repeat(auto-fit,minmax(${min},1fr));gap:var(--ds-space-4)`;
}
