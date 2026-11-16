import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import typescript from 'typescript';

function listSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(path);
    }
    return path.endsWith('.ts') && !path.endsWith('.d.ts') && !path.includes('.test.') ? [path] : [];
  });
}

export function* findDescendants(node) {
  yield node;
  const children = [];
  typescript.forEachChild(node, (child) => {
    children.push(child);
  });
  for (const child of children) {
    yield* findDescendants(child);
  }
}

function getDocumentation(node, name) {
  return typescript
    .getJSDocTags(node)
    .filter((tag) => tag.tagName.text === name)
    .map((tag) => String(tag.comment ?? '').split(/\s+/)[0]);
}

function findComponentFor(node) {
  if (!typescript.isClassDeclaration(node)) {
    return undefined;
  }
  const [tag] = getDocumentation(node, 'tag');
  return tag ? { tag, node, documented: new Set(getDocumentation(node, 'csspart')) } : undefined;
}

export function findDeclarationFor(node, checker) {
  let symbol = checker.getSymbolAtLocation(node);
  if (symbol?.flags & typescript.SymbolFlags.Alias) {
    symbol = checker.getAliasedSymbol(symbol);
  }
  return symbol?.valueDeclaration;
}

function isExecutableDeclaration(node) {
  return (
    typescript.isFunctionDeclaration(node) ||
    typescript.isClassDeclaration(node) ||
    (typescript.isVariableDeclaration(node) && Boolean(node.initializer))
  );
}

function getDependencies(node, checker, paths) {
  return [...findDescendants(node)]
    .filter(typescript.isIdentifier)
    .map((reference) => findDeclarationFor(reference, checker))
    .filter((declaration) => declaration && paths.has(declaration.getSourceFile().fileName))
    .filter(isExecutableDeclaration)
    .filter((declaration) => !findComponentFor(declaration));
}

function findReachableDeclarations(component, checker, paths) {
  const visited = new Set();
  const pending = [component.node];
  while (pending.length > 0) {
    const node = pending.pop();
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);
    pending.push(...getDependencies(node, checker, paths));
  }
  return [...visited];
}

export function createSourceGraph(root) {
  const paths = new Set(listSourceFiles(root));
  const program = typescript.createProgram([...paths], {
    target: typescript.ScriptTarget.Latest,
    module: typescript.ModuleKind.NodeNext,
  });
  const checker = program.getTypeChecker();
  const components = [...paths]
    .flatMap((path) => program.getSourceFile(path).statements)
    .map(findComponentFor)
    .filter(Boolean);
  return { checker, components, declarations: (component) => findReachableDeclarations(component, checker, paths) };
}
