import type { ComponentDocumentationEntry } from './custom-elements-manifest.js';

export function ComponentDocumentationTable({ title, items }: { title: string; items: ComponentDocumentationEntry[] }) {
  if (!items.length) {
    return null;
  }
  return (
    <>
      <h3>{title}</h3>
      <div className="ds-api-table-wrapper">
        <table className="ds-api-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td>
                  <code>{item.name || 'default'}</code>
                </td>
                <td>{item.description ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
