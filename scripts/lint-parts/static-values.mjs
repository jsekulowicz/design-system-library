import ts from 'typescript';
import { declarationFor } from './source-graph.mjs';

export const UNKNOWN = '__DS_DYNAMIC_PART__';

function concatenate(left, right) {
  return left.flatMap((prefix) => right.map((suffix) => prefix + suffix));
}

function templateValues(node, checker, visited) {
  return node.templateSpans.reduce(
    (values, span) => {
      const interpolated = concatenate(values, staticValues(span.expression, checker, visited));
      return interpolated.map((value) => value + span.literal.text);
    },
    [node.head.text],
  );
}

function expressionValues(node, checker, visited) {
  if (ts.isConditionalExpression(node)) {
    return [...staticValues(node.whenTrue, checker, visited), ...staticValues(node.whenFalse, checker, visited)];
  }
  if (ts.isTemplateExpression(node)) {
    return templateValues(node, checker, visited);
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return concatenate(staticValues(node.left, checker, visited), staticValues(node.right, checker, visited));
  }
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return staticValues(node.expression, checker, visited);
  }
  const declaration = ts.isIdentifier(node) && declarationFor(node, checker);
  return declaration?.initializer ? staticValues(declaration.initializer, checker, visited) : [UNKNOWN];
}

export function staticValues(node, checker, visited = new Set()) {
  if (!node || visited.has(node)) {
    return [UNKNOWN];
  }
  if (ts.isStringLiteralLike(node)) {
    return [node.text];
  }
  return expressionValues(node, checker, new Set([...visited, node]));
}
