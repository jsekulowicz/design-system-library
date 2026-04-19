import React from 'react';
import { Title, Description, Primary, Controls, Stories, useOf } from '@storybook/blocks';
import { ComponentApi } from './api-blocks.js';

export function DocsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolved = useOf('meta', ['meta']) as any;
  const tag = resolved?.csfFile?.meta?.component as string | undefined;
  return (
    <>
      <Title />
      <Description />
      <Primary />
      <h2>Props</h2>
      <Controls />
      {tag ? <ComponentApi tag={tag} /> : null}
      <Stories />
    </>
  );
}
