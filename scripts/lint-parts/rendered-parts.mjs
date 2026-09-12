import ts from 'typescript';
import { declarationFor, descendants } from './source-graph.mjs';
import { staticValues, UNKNOWN } from './static-values.mjs';

const ELEMENT = /<[a-z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const EXPRESSION = /__DS_EXPRESSION_(\d+)__/g;

function templateMarkup(template) {
  if (ts.isNoSubstitutionTemplateLiteral(template)) {
    return { markup: template.text, expressions: [] };
  }
  const markup = template.templateSpans.reduce((text, span, index) => {
    return `${text}__DS_EXPRESSION_${index}__${span.literal.text}`;
  }, template.head.text);
  return { markup, expressions: template.templateSpans.map((span) => span.expression) };
}

function attributeValues(value, expressions, checker) {
  return [...value.matchAll(EXPRESSION)].reduce(
    (values, [marker, index]) => {
      const replacements = staticValues(expressions[Number(index)], checker);
      return values.flatMap((text) => replacements.map((replacement) => text.replace(marker, replacement)));
    },
    [value],
  );
}

function namesInAttribute(name, value) {
  if (name === 'exportparts') {
    return value
      .split(',')
      .map((entry) => entry.split(':').pop().trim())
      .filter(Boolean);
  }
  return value.split(/\s+/).filter(Boolean);
}

function templateParts(template, checker) {
  const { markup, expressions } = templateMarkup(template);
  const elements = [...markup.replace(/<!--[\s\S]*?-->/g, '').matchAll(ELEMENT)];
  return elements
    .flatMap(([element]) => [...element.matchAll(ATTRIBUTE)])
    .filter(([, name]) => name === 'part' || name === 'exportparts')
    .flatMap(([, name, doubleQuoted, singleQuoted, unquoted]) => {
      return attributeValues(doubleQuoted ?? singleQuoted ?? unquoted ?? '', expressions, checker).flatMap((value) =>
        namesInAttribute(name, value),
      );
    });
}

function imperativeParts(node, checker) {
  if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)) {
    return [];
  }
  const [attribute, value] = node.arguments;
  if (node.expression.name.text !== 'setAttribute' || !attribute || !ts.isStringLiteralLike(attribute)) {
    return [];
  }
  return attribute.text === 'part'
    ? staticValues(value, checker).flatMap((text) => namesInAttribute('part', text))
    : [];
}

function partsForNode(node, checker) {
  if (ts.isTaggedTemplateExpression(node) && isRenderTemplateTag(node.tag, checker)) {
    return templateParts(node.template, checker);
  }
  return imperativeParts(node, checker);
}

function isRenderTemplateTag(tag, checker) {
  const declaration = declarationFor(tag, checker);
  return ['html', 'svg'].includes(declaration?.name?.getText() ?? tag.getText());
}

export function renderedParts(declarations, checker) {
  const nodes = new Set(declarations.flatMap((node) => [...descendants(node)]));
  const names = [...nodes].flatMap((node) => partsForNode(node, checker));
  return {
    known: new Set(names.filter((name) => !name.includes(UNKNOWN))),
    dynamic: new Set(names.filter((name) => name.includes(UNKNOWN))),
  };
}

export function matchesDynamicPart(name, pattern) {
  const escaped = pattern.split(UNKNOWN).map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${escaped.join('.*')}$`).test(name);
}
