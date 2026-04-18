import React from 'react';
import { Title, Description, Primary, Controls, Stories, useOf } from '@storybook/blocks';
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

function ApiSection({ title, items }: { title: string; items: Entry[] }) {
  if (!items.length) return null;
  return (
    <>
      <h2>{title}</h2>
      <table className="ds-api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.name}>
              <td>
                <code>{item.name || 'default'}</code>
              </td>
              <td>{item.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function DocsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolved = useOf('meta', ['meta']) as any;
  const tag = resolved?.csfFile?.meta?.component as string | undefined;
  const decl = tag ? findDeclaration(tag) : undefined;

  return (
    <>
      <Title />
      <Description />
      <Primary />
      <h2>Props</h2>
      <Controls />
      <ApiSection title="Slots" items={decl?.slots ?? []} />
      <ApiSection title="Events" items={decl?.events ?? []} />
      <ApiSection title="CSS Parts" items={decl?.cssParts ?? []} />
      <ApiSection title="CSS Variables" items={decl?.cssProperties ?? []} />
      <Stories />
    </>
  );
}
