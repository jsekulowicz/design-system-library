import { html, type TemplateResult } from 'lit';

function count(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.floor(value));
}

function range(length: number): number[] {
  return Array.from({ length }, (_, index) => index);
}

function headerWidth(index: number): string {
  const widths = ['70%', '52%', '62%', '44%', '58%'];
  return widths[index % widths.length] ?? '60%';
}

function labelWidth(index: number): string {
  const widths = ['52%', '68%', '46%', '60%', '42%'];
  return widths[index % widths.length] ?? '56%';
}

function valueWidth(rowIndex: number, columnIndex: number): string {
  const widths = ['74%', '58%', '86%', '48%', '66%', '92%', '54%'];
  return widths[(rowIndex + columnIndex) % widths.length] ?? '70%';
}

export function renderTableSkeleton(rowCount: number, columnCount: number): TemplateResult {
  const rows = range(count(rowCount, 5));
  const columns = range(count(columnCount, 4));

  return html`
    <table part="table" class="skeleton-table" aria-hidden="true">
      <colgroup>${columns.map(() => html`<col>`)}</colgroup>
      <thead part="thead">
        <tr>
          ${columns.map(index => html`
            <th part="header-cell" scope="col">
              <ds-skeleton width=${headerWidth(index)}></ds-skeleton>
            </th>
          `)}
        </tr>
      </thead>
      <tbody part="tbody">
        ${rows.map(rowIndex => html`
          <tr part="row">
            ${columns.map(columnIndex => html`
              <td part="cell">
                <ds-skeleton class="skeleton-label" width=${labelWidth(columnIndex)}></ds-skeleton>
                <ds-skeleton class="skeleton-value" width=${valueWidth(rowIndex, columnIndex)}></ds-skeleton>
              </td>
            `)}
          </tr>
        `)}
      </tbody>
    </table>
  `;
}
