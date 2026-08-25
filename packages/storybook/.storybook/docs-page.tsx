import { Title, Description, Primary, Stories, useOf } from '@storybook/addon-docs/blocks';
import { ComponentApi } from './api-blocks.js';
import { CollapsedControls } from './collapsed-controls.js';

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
      <CollapsedControls />
      {tag ? <ComponentApi tag={tag} /> : null}
      <Stories />
    </>
  );
}
