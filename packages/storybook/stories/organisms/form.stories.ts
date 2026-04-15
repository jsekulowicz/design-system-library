import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/form/define';
import '@ds/components/field/define';
import '@ds/components/text-field/define';
import '@ds/components/checkbox/define';
import '@ds/components/select/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Organisms/Form',
  component: 'ds-form',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const disciplines = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
];

export const AccountDetails: Story = {
  render: () => html`
    <div style="max-width:520px">
      <ds-form
        summary="Account details"
        @ds-submit=${(event: CustomEvent<{ data: FormData }>) => {
          console.log('submit', Object.fromEntries(event.detail.data.entries()));
        }}
        @ds-invalid=${() => console.warn('invalid')}
      >
        <ds-field label="Display name" help="Shown on invoices.">
          <ds-text-field name="name" required></ds-text-field>
        </ds-field>
        <ds-field label="Email" error="">
          <ds-text-field type="email" name="email" required></ds-text-field>
        </ds-field>
        <ds-field label="Discipline">
          <ds-select name="discipline" .options=${disciplines}></ds-select>
        </ds-field>
        <ds-checkbox name="newsletter">
          Send me a weekly change log digest
        </ds-checkbox>
        <div slot="actions">
          <ds-button variant="ghost" type="reset">Cancel</ds-button>
          <ds-button variant="primary" type="submit">Save</ds-button>
        </div>
      </ds-form>
    </div>
  `,
};
