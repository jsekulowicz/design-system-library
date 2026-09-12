import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path);
    }
    return path.endsWith('.ts') && !path.endsWith('.d.ts') && !path.includes('.test.') ? [path] : [];
  });
}

export function* descendants(node) {
  yield node;
  const children = [];
  ts.forEachChild(node, (child) => {
    children.push(child);
  });
  for (const child of children) {
    yield* descendants(child);
  }
}

function documentation(node, name) {
  return ts
    .getJSDocTags(node)
    .filter((tag) => tag.tagName.text === name)
    .map((tag) => String(tag.comment ?? '').split(/\s+/)[0]);
}

function componentFor(node) {
  if (!ts.isClassDeclaration(node)) {
    return undefined;
  }
  const [tag] = documentation(node, 'tag');
  return tag ? { tag, node, documented: new Set(documentation(node, 'csspart')) } : undefined;
}

export function declarationFor(node, checker) {
  let symbol = checker.getSymbolAtLocation(node);
  if (symbol?.flags & ts.SymbolFlags.Alias) {
    symbol = checker.getAliasedSymbol(symbol);
  }
  return symbol?.valueDeclaration;
}

function isExecutableDeclaration(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    (ts.isVariableDeclaration(node) && Boolean(node.initializer))
  );
}

function dependencies(node, checker, paths) {
  return [...descendants(node)]
    .filter(ts.isIdentifier)
    .map((reference) => declarationFor(reference, checker))
    .filter((declaration) => declaration && paths.has(declaration.getSourceFile().fileName))
    .filter(isExecutableDeclaration)
    .filter((declaration) => !componentFor(declaration));
}

function reachableDeclarations(component, checker, paths) {
  const visited = new Set();
  const pending = [component.node];
  while (pending.length > 0) {
    const node = pending.pop();
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);
    pending.push(...dependencies(node, checker, paths));
  }
  return [...visited];
}

export function createSourceGraph(root) {
  const paths = new Set(sourceFiles(root));
  const program = ts.createProgram([...paths], { target: ts.ScriptTarget.Latest, module: ts.ModuleKind.NodeNext });
  const checker = program.getTypeChecker();
  const components = [...paths]
    .flatMap((path) => program.getSourceFile(path).statements)
    .map(componentFor)
    .filter(Boolean);
  return { checker, components, declarations: (component) => reachableDeclarations(component, checker, paths) };
}
