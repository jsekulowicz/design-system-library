import typescript from 'typescript';
import { findDeclarationFor } from './source-graph.mjs';

export const UNKNOWN = '__DS_DYNAMIC_PART__';

function concatenate(left, right) {
  return left.flatMap((prefix) => right.map((suffix) => prefix + suffix));
}

function getTemplateValues(node, checker, visited) {
  return node.templateSpans.reduce(
    (values, span) => {
      const interpolated = concatenate(values, getStaticValues(span.expression, checker, visited));
      return interpolated.map((value) => value + span.literal.text);
    },
    [node.head.text],
  );
}

function getExpressionValues(node, checker, visited) {
  if (typescript.isConditionalExpression(node)) {
    return [...getStaticValues(node.whenTrue, checker, visited), ...getStaticValues(node.whenFalse, checker, visited)];
  }
  if (typescript.isTemplateExpression(node)) {
    return getTemplateValues(node, checker, visited);
  }
  if (typescript.isBinaryExpression(node) && node.operatorToken.kind === typescript.SyntaxKind.PlusToken) {
    return concatenate(getStaticValues(node.left, checker, visited), getStaticValues(node.right, checker, visited));
  }
  if (
    typescript.isParenthesizedExpression(node) ||
    typescript.isAsExpression(node) ||
    typescript.isSatisfiesExpression(node)
  ) {
    return getStaticValues(node.expression, checker, visited);
  }
  const declaration = typescript.isIdentifier(node) && findDeclarationFor(node, checker);
  return declaration?.initializer ? getStaticValues(declaration.initializer, checker, visited) : [UNKNOWN];
}

export function getStaticValues(node, checker, visited = new Set()) {
  if (!node || visited.has(node)) {
    return [UNKNOWN];
  }
  if (typescript.isStringLiteralLike(node)) {
    return [node.text];
  }
  return getExpressionValues(node, checker, new Set([...visited, node]));
}
