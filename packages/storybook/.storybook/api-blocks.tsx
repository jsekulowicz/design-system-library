import { ComponentDocumentationTable } from './api-tables.js';
import { findCustomElementDocumentation } from './custom-elements-manifest.js';

function getRegistrationImport(modulePath: string): string {
  const [, , componentName] = modulePath.split('/');
  return `@jsekulowicz/ds-components/${componentName}/define`;
}

export function ComponentApi({ tag }: { tag: string }) {
  const component = findCustomElementDocumentation(tag);
  if (!component) {
    return null;
  }
  const { declaration, modulePath } = component;
  const registrationImport = getRegistrationImport(modulePath);
  return (
    <>
      <h3>Import</h3>
      <pre className="ds-component-import">
        <code>{`import '${registrationImport}';`}</code>
      </pre>
      <ComponentDocumentationTable title="Slots" items={declaration.slots ?? []} />
      <ComponentDocumentationTable title="Events" items={declaration.events ?? []} />
      <ComponentDocumentationTable title="CSS Parts" items={declaration.cssParts ?? []} />
      <ComponentDocumentationTable title="CSS Variables" items={declaration.cssProperties ?? []} />
    </>
  );
}
