import { ComponentDocumentationTable, ComponentPropertyDocumentationTable } from './api-tables.js';
import { findCustomElementDocumentation, getPublicPropertyDocumentation } from './custom-elements-manifest.js';

interface ComponentApiProps {
  includeProperties?: boolean;
  tag: string;
}

function getRegistrationImport(modulePath: string): string {
  const [, , componentName] = modulePath.split('/');
  return `@jsekulowicz/ds-components/${componentName}/define`;
}

export function ComponentApi({ includeProperties = false, tag }: ComponentApiProps) {
  const component = findCustomElementDocumentation(tag);
  if (!component) {
    return null;
  }
  const { declaration, modulePath } = component;
  const registrationImport = getRegistrationImport(modulePath);
  return (
    <>
      {includeProperties ? (
        <ComponentPropertyDocumentationTable items={getPublicPropertyDocumentation(declaration)} />
      ) : null}
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
