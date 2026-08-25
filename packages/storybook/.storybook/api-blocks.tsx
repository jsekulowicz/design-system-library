import cem from '../../components/custom-elements.json';
import { ApiTable, PropertiesTable, type ApiEntry, type ApiProperty } from './api-tables.js';

interface CemMember extends ApiProperty {
  kind: string;
  privacy?: string;
  static?: boolean;
}

interface CemAttribute extends ApiEntry {
  default?: unknown;
  fieldName?: string;
  type?: { text?: string };
}

interface CemDeclaration {
  attributes?: CemAttribute[];
  cssParts?: ApiEntry[];
  cssProperties?: ApiEntry[];
  events?: ApiEntry[];
  members?: CemMember[];
  slots?: ApiEntry[];
  tagName?: string;
}

interface CemModule {
  declarations?: unknown[];
  path: string;
}

function findComponent(tag: string): { declaration: CemDeclaration; modulePath: string } | undefined {
  for (const module of cem.modules as CemModule[]) {
    const declaration = (module.declarations as CemDeclaration[] | undefined)?.find((item) => item.tagName === tag);
    if (declaration) {
      return { declaration, modulePath: module.path };
    }
  }
  return undefined;
}

function getRegistrationImport(modulePath: string): string {
  const [, , componentName] = modulePath.split('/');
  return `@jsekulowicz/ds-components/${componentName}/define`;
}

function getPublicProperties(declaration: CemDeclaration): ApiProperty[] {
  const attributes = new Map((declaration.attributes ?? []).map((attribute) => [attribute.fieldName, attribute]));
  return (declaration.members ?? [])
    .filter(
      (member) =>
        member.kind === 'field' && !member.static && member.privacy !== 'private' && !member.name.startsWith('#'),
    )
    .map((member) => {
      const attribute = attributes.get(member.name);
      return {
        attribute: attribute?.name ?? member.attribute,
        default: member.default ?? attribute?.default,
        description: member.description ?? attribute?.description,
        name: member.name,
        type: member.type ?? attribute?.type,
      };
    });
}

export function ComponentApi({ tag }: { tag: string }) {
  const component = findComponent(tag);
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
      <PropertiesTable items={getPublicProperties(declaration)} />
      <ApiTable title="Slots" items={declaration.slots ?? []} />
      <ApiTable title="Events" items={declaration.events ?? []} />
      <ApiTable title="CSS Parts" items={declaration.cssParts ?? []} />
      <ApiTable title="CSS Variables" items={declaration.cssProperties ?? []} />
    </>
  );
}
