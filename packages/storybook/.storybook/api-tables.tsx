import type { ReactNode } from 'react';
import type { ComponentDocumentationEntry, ComponentPropertyDocumentation } from './custom-elements-manifest.js';

function displayDocumentationValue(value: unknown): string {
  if (value === undefined) {
    return '-';
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function renderInlineCode(value: string | undefined): ReactNode {
  if (!value) {
    return '-';
  }
  return value
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith('`') && part.endsWith('`') ? <code key={index}>{part.slice(1, -1)}</code> : part,
    );
}

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
                <td>{renderInlineCode(item.description)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function ComponentPropertyDocumentationTable({ items }: { items: ComponentPropertyDocumentation[] }) {
  if (!items.length) {
    return null;
  }
  return (
    <>
      <h3>Props</h3>
      <div className="ds-api-table-wrapper">
        <table className="ds-api-table ds-properties-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Attribute</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td>
                  <code>{item.name}</code>
                </td>
                <td>{item.attribute ? <code>{item.attribute}</code> : '-'}</td>
                <td>
                  <code>{item.type?.text ?? 'unknown'}</code>
                </td>
                <td>
                  <code>{displayDocumentationValue(item.default)}</code>
                </td>
                <td>{renderInlineCode(item.description)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
