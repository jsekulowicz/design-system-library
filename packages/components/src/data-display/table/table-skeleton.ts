import { html, type TemplateResult } from 'lit';

function toCount(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.floor(value));
}

function buildRange(length: number): number[] {
  return Array.from({ length }, (_, index) => index);
}

function getHeaderWidth(index: number): string {
  const widths = ['70%', '52%', '62%', '44%', '58%'];
  return widths[index % widths.length] ?? '60%';
}

function getLabelWidth(index: number): string {
  const widths = ['52%', '68%', '46%', '60%', '42%'];
  return widths[index % widths.length] ?? '56%';
}

function getValueWidth(rowIndex: number, columnIndex: number): string {
  const widths = ['74%', '58%', '86%', '48%', '66%', '92%', '54%'];
  return widths[(rowIndex + columnIndex) % widths.length] ?? '70%';
}

export function renderTableSkeleton(rowCount: number, columnCount: number): TemplateResult {
  const rows = buildRange(toCount(rowCount, 5));
  const columns = buildRange(toCount(columnCount, 4));

  return html`
    <table part="table" class="skeleton-table" aria-hidden="true">
      <colgroup>
        ${columns.map(() => html`<col />`)}
      </colgroup>
      <thead part="thead">
        <tr>
          ${columns.map(
            (index) => html`
              <th part="header-cell" scope="col">
                <ds-skeleton width=${getHeaderWidth(index)}></ds-skeleton>
              </th>
            `,
          )}
        </tr>
      </thead>
      <tbody part="tbody">
        ${rows.map(
          (rowIndex) => html`
            <tr part="row">
              ${columns.map(
                (columnIndex) => html`
                  <td part="cell">
                    <ds-skeleton class="skeleton-label" width=${getLabelWidth(columnIndex)}></ds-skeleton>
                    <ds-skeleton class="skeleton-value" width=${getValueWidth(rowIndex, columnIndex)}></ds-skeleton>
                  </td>
                `,
              )}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}
