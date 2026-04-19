import React from 'react';
import cem from '../../components/custom-elements.json';

type Entry = { name: string; description?: string };
type CemDeclaration = {
  kind: string;
  tagName?: string;
  slots?: Entry[];
  events?: Entry[];
  cssParts?: Entry[];
  cssProperties?: Entry[];
};
type CemModule = { declarations?: unknown[] };

function findDeclaration(tag: string): CemDeclaration | undefined {
  return (cem.modules as CemModule[])
    .flatMap(m => (m.declarations ?? []) as CemDeclaration[])
    .find(d => d.tagName === tag);
}

function ApiTable({ title, items }: { title: string; items: Entry[] }) {
  if (!items.length) {
    return null;
  }
  return (
    <>
      <h3>{title}</h3>
      <table className="ds-api-table">
        <colgroup>
          <col className="ds-api-col-name" />
          <col className="ds-api-col-description" />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.name}>
              <td><code>{item.name || 'default'}</code></td>
              <td>{item.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function ComponentApi({ tag }: { tag: string }) {
  const decl = findDeclaration(tag);
  if (!decl) {
    return null;
  }
  return (
    <>
      <ApiTable title="Slots" items={decl.slots ?? []} />
      <ApiTable title="Events" items={decl.events ?? []} />
      <ApiTable title="CSS Parts" items={decl.cssParts ?? []} />
      <ApiTable title="CSS Variables" items={decl.cssProperties ?? []} />
    </>
  );
}
