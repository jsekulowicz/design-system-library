import type { ArgTypesEnhancer, StrictInputType } from 'storybook/internal/types';
import {
  findCustomElementDocumentation,
  getPublicPropertyDocumentation,
  type ComponentPropertyDocumentation,
} from './custom-elements-manifest.js';

function formatDisplayValue(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatDisplayOptions(options: readonly unknown[] | undefined): string | undefined {
  if (!options?.length) {
    return undefined;
  }
  return options
    .map((option) => (typeof option === 'string' ? `'${option.replaceAll("'", "\\'")}'` : JSON.stringify(option)))
    .join(' | ');
}

function enrichArgumentType(argumentType: StrictInputType, property: ComponentPropertyDocumentation): StrictInputType {
  const typeSummary = formatDisplayOptions(argumentType.options) ?? property.type?.text;
  const defaultSummary = formatDisplayValue(property.default);
  return {
    ...argumentType,
    description: argumentType.description ?? property.description,
    table: {
      ...argumentType.table,
      defaultValue: argumentType.table?.defaultValue ?? (defaultSummary ? { summary: defaultSummary } : undefined),
      type: argumentType.table?.type ?? (typeSummary ? { summary: typeSummary } : undefined),
    },
  };
}

export function enrichArgTypesFromManifest(context: Parameters<ArgTypesEnhancer>[0]): ReturnType<ArgTypesEnhancer> {
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
}
