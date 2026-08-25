import type { ArgTypesEnhancer, StrictInputType } from 'storybook/internal/types';
import {
  findCustomElementDocumentation,
  getPublicPropertyDocumentation,
  type ComponentPropertyDocumentation,
} from './custom-elements-manifest.js';

function displayValue(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function displayOptions(options: readonly unknown[] | undefined): string | undefined {
  if (!options?.length) {
    return undefined;
  }
  return options
    .map((option) => (typeof option === 'string' ? `'${option.replaceAll("'", "\\'")}'` : JSON.stringify(option)))
    .join(' | ');
}

function getPropertyDescription(property: ComponentPropertyDocumentation): string {
  if (property.description) {
    return property.description;
  }
  const readableName = property.name.replaceAll(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  const purpose = property.type?.text === 'boolean' ? `Enables or disables ${readableName}.` : `Sets ${readableName}.`;
  const attribute = property.attribute ? ` HTML attribute: \`${property.attribute}\`.` : '';
  return `${purpose}${attribute}`;
}

function enrichArgumentType(argumentType: StrictInputType, property: ComponentPropertyDocumentation): StrictInputType {
  const typeSummary = displayOptions(argumentType.options) ?? property.type?.text;
  const defaultSummary = displayValue(property.default);
  return {
    ...argumentType,
    description: argumentType.description ?? getPropertyDescription(property),
    table: {
      ...argumentType.table,
      defaultValue: argumentType.table?.defaultValue ?? (defaultSummary ? { summary: defaultSummary } : undefined),
      type: argumentType.table?.type ?? (typeSummary ? { summary: typeSummary } : undefined),
    },
  };
}

export const enrichArgumentTypesFromCustomElementsManifest: ArgTypesEnhancer = function (context) {
  if (typeof context.component !== 'string') {
    return context.argTypes;
  }
  const documentation = findCustomElementDocumentation(context.component);
  if (!documentation) {
    return context.argTypes;
  }
  const properties = new Map(
    getPublicPropertyDocumentation(documentation.declaration).map((property) => [property.name, property]),
  );
  return Object.fromEntries(
    Object.entries(context.argTypes).map(([name, argumentType]) => {
      const property = properties.get(name);
      return [name, property ? enrichArgumentType(argumentType, property) : argumentType];
    }),
  );
};
