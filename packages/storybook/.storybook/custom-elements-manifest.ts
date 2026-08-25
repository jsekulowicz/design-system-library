import customElementsManifest from '../../components/custom-elements.json';

export interface ComponentDocumentationEntry {
  name: string;
  description?: string;
}

export interface ComponentPropertyDocumentation extends ComponentDocumentationEntry {
  attribute?: string;
  default?: unknown;
  type?: { text?: string };
}

interface CustomElementsManifestMember extends ComponentPropertyDocumentation {
  kind: string;
  privacy?: string;
  static?: boolean;
}

interface CustomElementsManifestAttribute extends ComponentDocumentationEntry {
  default?: unknown;
  fieldName?: string;
  type?: { text?: string };
}

export interface CustomElementDeclaration {
  attributes?: CustomElementsManifestAttribute[];
  cssParts?: ComponentDocumentationEntry[];
  cssProperties?: ComponentDocumentationEntry[];
  events?: ComponentDocumentationEntry[];
  members?: CustomElementsManifestMember[];
  slots?: ComponentDocumentationEntry[];
  tagName?: string;
}

interface CustomElementsManifestModule {
  declarations?: unknown[];
  path: string;
}

export interface CustomElementDocumentation {
  declaration: CustomElementDeclaration;
  modulePath: string;
}

export function findCustomElementDocumentation(tag: string): CustomElementDocumentation | undefined {
  for (const module of customElementsManifest.modules as CustomElementsManifestModule[]) {
    const declarations = module.declarations as CustomElementDeclaration[] | undefined;
    const declaration = declarations?.find((item) => item.tagName === tag);
    if (declaration) {
      return { declaration, modulePath: module.path };
    }
  }
  return undefined;
}

export function getPublicPropertyDocumentation(
  declaration: CustomElementDeclaration,
): ComponentPropertyDocumentation[] {
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
