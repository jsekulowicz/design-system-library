import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ds-app',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main class="shell">
      <header>
        <span class="eyebrow">&#64;ds/components · Angular 18</span>
        <h1>Form-associated web components, formControl bindings.</h1>
      </header>

      <ds-form summary="Create project" (ds-submit)="onSubmit($event)">
        <ds-field label="Project name">
          <ds-text-field
            name="project"
            [value]="project()"
            (ds-input)="project.set($any($event).detail.value)"
            required
          ></ds-text-field>
        </ds-field>
        <ds-field label="Description" help="Markdown is supported.">
          <ds-text-field name="description"></ds-text-field>
        </ds-field>
        <div slot="actions">
          <ds-button variant="ghost" type="reset">Clear</ds-button>
          <ds-button variant="primary" type="submit">Create</ds-button>
        </div>
      </ds-form>

      <pre *ngIf="submitted()">{{ submitted() | json }}</pre>
    </main>
  `,
  styles: [
    `
      .shell {
        max-width: 560px;
        margin: var(--ds-space-12) auto;
        padding: var(--ds-space-6);
        display: grid;
        gap: var(--ds-space-6);
      }
      .eyebrow {
        color: var(--ds-color-fg-muted);
        font-family: var(--ds-font-body);
      }
      h1 {
        font-family: var(--ds-font-display);
        font-size: var(--ds-font-size-3xl);
        margin: 0;
      }
      pre {
        font-family: var(--ds-font-mono);
        background: var(--ds-color-bg-subtle);
        padding: var(--ds-space-4);
        border-radius: var(--ds-radius-sm);
      }
    `,
  ],
})
export class AppComponent {
  readonly project = signal('');
  readonly submitted = signal<Record<string, unknown> | null>(null);

  onSubmit(event: Event): void {
    const detail = (event as CustomEvent<{ data: FormData }>).detail;
    this.submitted.set(Object.fromEntries(detail.data.entries()));
  }
}
