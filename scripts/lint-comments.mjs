import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

const SCRIPT_EXTENSION = /\.(?:cjs|js|mjs|ts|tsx)$/;
const EXEMPT_PATHS = [
  /^packages\/components\/src\/data-display\/icon\/icons\//,
  /^scripts\/lint-parts\/rendered-parts\.test\.mjs$/,
];
const DIRECTIVE = /^\/[/*]\s*(?:eslint|@ts-|prettier-ignore|istanbul|c8 |v8 ignore)/;
const API_TAG = /@(?:tag|attr|attribute|prop|property|cssprop|cssproperty|csspart|part|slot|event|fires|summary)\b/;
const COMMENT_IN_TEMPLATE = /\/\*[\s\S]*?\*\/|<!--|^\s*\/\/ /m;
const TEMPLATE_KINDS = new Set([
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
]);
const CONTAINER_KINDS = new Set([ts.SyntaxKind.SourceFile, ts.SyntaxKind.SyntaxList]);

function isInWorkingTree(file) {
  return existsSync(file);
}

function listTrackedScripts() {
  return execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter((file) => SCRIPT_EXTENSION.test(file))
    .filter((file) => !EXEMPT_PATHS.some((pattern) => pattern.test(file)))
    .filter(isInWorkingTree);
}

function hasModifier(node, kind) {
  return ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === kind);
}

function isOnThePublicSurface(node) {
  if (!node || hasModifier(node, ts.SyntaxKind.PrivateKeyword)) {
    return false;
  }
  if (ts.isClassElement(node)) {
    return !(node.name && ts.isPrivateIdentifier(node.name));
  }
  return ts.isTypeElement(node) || hasModifier(node, ts.SyntaxKind.ExportKeyword);
}

function isAllowedComment(body, documentedNode) {
  if (DIRECTIVE.test(body)) {
    return true;
  }
  return body.startsWith('/**') && (API_TAG.test(body) || isOnThePublicSurface(documentedNode));
}

function walkEveryNodeAndToken(source, visit) {
  function walk(node) {
    visit(node);
    node.getChildren(source).forEach(walk);
  }
  walk(source);
}

function collectCommentRanges(source, node, ranges) {
  const text = source.text;
  for (const range of [
    ...(ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []),
    ...(ts.getTrailingCommentRanges(text, node.getEnd()) ?? []),
  ]) {
    ranges.set(range.pos, range);
  }
}

function registerOutermostNode(source, node, nodesByStart) {
  const start = node.getStart(source);
  if (!CONTAINER_KINDS.has(node.kind) && !nodesByStart.has(start)) {
    nodesByStart.set(start, node);
  }
}

function findDocumentedNode(text, range, nodesByStart) {
  const afterComment = text.slice(range.end).search(/\S/);
  return nodesByStart.get(range.end + afterComment);
}

function toViolation(file, source, position, body) {
  const { line } = source.getLineAndCharacterOfPosition(position);
  return `${file}:${line + 1}  ${body.trim().split('\n')[0].slice(0, 100)}`;
}

function parseSource(file) {
  const kind = /\.tsx?$/.test(file) ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, kind);
}

function findCommentInTemplate(source, node) {
  if (!TEMPLATE_KINDS.has(node.kind)) {
    return null;
  }
  return node.getText(source).match(COMMENT_IN_TEMPLATE)?.[0] ?? null;
}

function findViolationsIn(file) {
  const source = parseSource(file);
  const ranges = new Map();
  const nodesByStart = new Map();
  const violations = [];
  walkEveryNodeAndToken(source, (node) => {
    collectCommentRanges(source, node, ranges);
    registerOutermostNode(source, node, nodesByStart);
    const templateComment = findCommentInTemplate(source, node);
    if (templateComment !== null) {
      violations.push(toViolation(file, source, node.getStart(source), templateComment));
    }
  });
  const disallowed = [...ranges.values()].filter(
    (range) =>
      !isAllowedComment(source.text.slice(range.pos, range.end), findDocumentedNode(source.text, range, nodesByStart)),
  );
  return [
    ...violations,
    ...disallowed.map((range) => toViolation(file, source, range.pos, source.text.slice(range.pos, range.end))),
  ];
}

const violations = listTrackedScripts().flatMap(findViolationsIn);

if (violations.length > 0) {
  console.error(`${violations.length} comment(s) to turn into names, tests or public JSDoc:\n`);
  console.error(violations.join('\n'));
  process.exitCode = 1;
}
