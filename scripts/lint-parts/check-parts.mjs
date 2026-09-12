import { createSourceGraph } from './source-graph.mjs';
import { renderedParts, matchesDynamicPart } from './rendered-parts.mjs';
import { UNKNOWN } from './static-values.mjs';

const RUNTIME_PARTS = new Map([
  [
    'ds-page-shell',
    {
      reason: 'aside toggle and rail names interpolate the side',
      names: ['aside-toggle-start', 'aside-toggle-end', 'aside-toggle-start-rail', 'aside-toggle-end-rail'],
    },
  ],
  [
    'ds-table-pagination',
    {
      reason: 'previous and next button names are passed to renderPrevNext',
      names: ['button-prev', 'button-next'],
    },
  ],
]);

function difference(left, right) {
  return [...left].filter((name) => !right.has(name)).sort();
}

function runtimeNames(component, rendered, exceptions) {
  const allowed = exceptions.get(component.tag)?.names ?? [];
  return allowed.filter(
    (name) =>
      component.documented.has(name) && [...rendered.dynamic].some((pattern) => matchesDynamicPart(name, pattern)),
  );
}

function checkComponent(component, graph, exceptions) {
  const rendered = renderedParts(graph.declarations(component), graph.checker);
  const runtime = runtimeNames(component, rendered, exceptions);
  const exposed = new Set([...rendered.known, ...runtime]);
  return {
    tag: component.tag,
    file: component.node.getSourceFile().fileName,
    undocumented: difference(rendered.known, component.documented),
    unrendered: difference(component.documented, exposed),
    unresolved: [...rendered.dynamic]
      .filter((pattern) => !runtime.some((name) => matchesDynamicPart(name, pattern)))
      .map((pattern) => pattern.replaceAll(UNKNOWN, '${...}')),
    runtime,
  };
}

function staleExceptions(results, exceptions) {
  return [...exceptions].flatMap(([tag, { names, reason }]) => {
    const component = results.find((result) => result.tag === tag);
    return names.filter((name) => !component?.runtime.includes(name)).map((part) => ({ tag, part, reason }));
  });
}

export function checkParts(root, exceptions = RUNTIME_PARTS) {
  const graph = createSourceGraph(root);
  const results = graph.components.map((component) => checkComponent(component, graph, exceptions));
  return {
    violations: results.filter(
      (result) => result.undocumented.length || result.unrendered.length || result.unresolved.length,
    ),
    stale: staleExceptions(results, exceptions),
  };
}
