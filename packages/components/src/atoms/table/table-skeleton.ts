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

function cellWidth(index: number): string {
  const widths = ['70%', '52%', '62%', '44%', '58%'];
  return widths[index % widths.length] ?? '60%';
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
              <ds-skeleton width=${cellWidth(index)}></ds-skeleton>
            </th>
          `)}
        </tr>
      </thead>
      <tbody part="tbody">
        ${rows.map(() => html`
          <tr part="row">
            ${columns.map(index => html`
              <td part="cell">
                <ds-skeleton width=${cellWidth(index)}></ds-skeleton>
              </td>
            `)}
          </tr>
        `)}
      </tbody>
    </table>
  `;
}
