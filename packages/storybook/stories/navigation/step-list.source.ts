import type { StepListStep } from '@jsekulowicz/ds-components/step-list';
import { CHECKOUT_STEPS } from './step-list.examples.js';

interface StepListSourceOptions {
  steps?: StepListStep[];
  currentIndex: number;
  label?: string;
  compact?: boolean;
  containerStyle?: string;
  interactive?: boolean;
  trailing?: boolean;
}

const SELECT_HANDLER = `function moveToTheSelectedStep(event: Event): void {
  const list = event.currentTarget as DsStepList;
  list.currentIndex = (event as CustomEvent<{ index: number }>).detail.index;
}`;

const RESET_HANDLER = `function startOverFromTheFirstStep(event: Event): void {
  const list = (event.currentTarget as HTMLElement).closest<DsStepList>('ds-step-list');
  if (list) {
    list.currentIndex = 0;
  }
}`;

const TRAILING_BUTTON = `
  <ds-button slot="trailing" variant="ghost" size="sm" @click=\${startOverFromTheFirstStep}>
    <ds-icon slot="leading" name="arrow-path" size="lg"></ds-icon>
    Start over
  </ds-button>
`;

function stepListImports(options: StepListSourceOptions): string {
  const imports = ["import { html } from 'lit';", "import '@jsekulowicz/ds-components/step-list/define';"];
  if (options.interactive) {
    imports.push("import type { DsStepList } from '@jsekulowicz/ds-components/step-list';");
  }
  if (options.trailing) {
    imports.push(
      "import '@jsekulowicz/ds-components/button/define';",
      "import '@jsekulowicz/ds-components/icon/define';",
      "import '@jsekulowicz/ds-components/icon/arrow-path';",
    );
  }
  return imports.join('\n');
}

function stepListTemplate(options: StepListSourceOptions): string {
  const bindings = ['.steps=${steps}', `.currentIndex=\${${options.currentIndex}}`];
  if (options.label !== undefined) {
    bindings.push(`.label=\${${JSON.stringify(options.label)}}`);
  }
  if (options.compact !== undefined) {
    bindings.push(`?compact=\${${options.compact}}`);
  }
  if (options.interactive) {
    bindings.push('@ds-step-select=${moveToTheSelectedStep}');
  }
  const content = options.trailing ? TRAILING_BUTTON : '';
  const element = `<ds-step-list\n  ${bindings.join('\n  ')}\n>${content}</ds-step-list>`;
  return options.containerStyle ? `<div style="${options.containerStyle}">\n${indent(element)}\n</div>` : element;
}

function indent(source: string): string {
  return source.replace(/^/gm, '  ');
}

export function stepListSourceParameters(options: StepListSourceOptions) {
  const setup = [
    stepListImports(options),
    `const steps = ${JSON.stringify(options.steps ?? CHECKOUT_STEPS, null, 2)};`,
  ];
  if (options.interactive) {
    setup.push(SELECT_HANDLER);
  }
  if (options.trailing) {
    setup.push(RESET_HANDLER);
  }
  const code = `${setup.join('\n\n')}\n\nhtml\`\n${indent(stepListTemplate(options))}\n\`;`;
  return { docs: { source: { code, language: 'ts', type: 'code' } } };
}
