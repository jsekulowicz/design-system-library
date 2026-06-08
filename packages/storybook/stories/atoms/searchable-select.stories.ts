import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { SelectOption } from '@jsekulowicz/ds-components/select';
import '@jsekulowicz/ds-components/searchable-select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/magnifying-glass';
import '@jsekulowicz/ds-components/icon/squares-2x2';
import '@jsekulowicz/ds-components/icon/paint-brush';
import '@jsekulowicz/ds-components/icon/wrench';
import '@jsekulowicz/ds-components/icon/cube';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';

const COUNTRIES: SelectOption[] = [
  { value: 'af', label: '🇦🇫 Afghanistan' },
  { value: 'al', label: '🇦🇱 Albania' },
  { value: 'dz', label: '🇩🇿 Algeria' },
  { value: 'ad', label: '🇦🇩 Andorra' },
  { value: 'ao', label: '🇦🇴 Angola' },
  { value: 'ar', label: '🇦🇷 Argentina' },
  { value: 'am', label: '🇦🇲 Armenia' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'at', label: '🇦🇹 Austria' },
  { value: 'az', label: '🇦🇿 Azerbaijan' },
  { value: 'bs', label: '🇧🇸 Bahamas' },
  { value: 'bh', label: '🇧🇭 Bahrain' },
  { value: 'bd', label: '🇧🇩 Bangladesh' },
  { value: 'by', label: '🇧🇾 Belarus' },
  { value: 'be', label: '🇧🇪 Belgium' },
  { value: 'bz', label: '🇧🇿 Belize' },
  { value: 'bj', label: '🇧🇯 Benin' },
  { value: 'bt', label: '🇧🇹 Bhutan' },
  { value: 'bo', label: '🇧🇴 Bolivia' },
  { value: 'ba', label: '🇧🇦 Bosnia and Herzegovina' },
  { value: 'bw', label: '🇧🇼 Botswana' },
  { value: 'br', label: '🇧🇷 Brazil' },
  { value: 'bn', label: '🇧🇳 Brunei' },
  { value: 'bg', label: '🇧🇬 Bulgaria' },
  { value: 'bf', label: '🇧🇫 Burkina Faso' },
  { value: 'bi', label: '🇧🇮 Burundi' },
  { value: 'kh', label: '🇰🇭 Cambodia' },
  { value: 'cm', label: '🇨🇲 Cameroon' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'td', label: '🇹🇩 Chad' },
  { value: 'cl', label: '🇨🇱 Chile' },
  { value: 'cn', label: '🇨🇳 China' },
  { value: 'co', label: '🇨🇴 Colombia' },
  { value: 'cr', label: '🇨🇷 Costa Rica' },
  { value: 'hr', label: '🇭🇷 Croatia' },
  { value: 'cu', label: '🇨🇺 Cuba' },
  { value: 'cy', label: '🇨🇾 Cyprus' },
  { value: 'cz', label: '🇨🇿 Czech Republic' },
  { value: 'dk', label: '🇩🇰 Denmark' },
  { value: 'do', label: '🇩🇴 Dominican Republic' },
  { value: 'ec', label: '🇪🇨 Ecuador' },
  { value: 'eg', label: '🇪🇬 Egypt' },
  { value: 'sv', label: '🇸🇻 El Salvador' },
  { value: 'ee', label: '🇪🇪 Estonia' },
  { value: 'et', label: '🇪🇹 Ethiopia' },
  { value: 'fj', label: '🇫🇯 Fiji' },
  { value: 'fi', label: '🇫🇮 Finland' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'ge', label: '🇬🇪 Georgia' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'gh', label: '🇬🇭 Ghana' },
  { value: 'gr', label: '🇬🇷 Greece' },
  { value: 'gt', label: '🇬🇹 Guatemala' },
  { value: 'gy', label: '🇬🇾 Guyana' },
  { value: 'ht', label: '🇭🇹 Haiti' },
  { value: 'hn', label: '🇭🇳 Honduras' },
  { value: 'hu', label: '🇭🇺 Hungary' },
  { value: 'is', label: '🇮🇸 Iceland' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'id', label: '🇮🇩 Indonesia' },
  { value: 'ir', label: '🇮🇷 Iran' },
  { value: 'iq', label: '🇮🇶 Iraq' },
  { value: 'ie', label: '🇮🇪 Ireland' },
  { value: 'il', label: '🇮🇱 Israel' },
  { value: 'it', label: '🇮🇹 Italy' },
  { value: 'jm', label: '🇯🇲 Jamaica' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'jo', label: '🇯🇴 Jordan' },
  { value: 'kz', label: '🇰🇿 Kazakhstan' },
  { value: 'ke', label: '🇰🇪 Kenya' },
  { value: 'kr', label: '🇰🇷 South Korea' },
  { value: 'kw', label: '🇰🇼 Kuwait' },
  { value: 'kg', label: '🇰🇬 Kyrgyzstan' },
  { value: 'la', label: '🇱🇦 Laos' },
  { value: 'lv', label: '🇱🇻 Latvia' },
  { value: 'lb', label: '🇱🇧 Lebanon' },
  { value: 'ly', label: '🇱🇾 Libya' },
  { value: 'lt', label: '🇱🇹 Lithuania' },
  { value: 'lu', label: '🇱🇺 Luxembourg' },
  { value: 'mg', label: '🇲🇬 Madagascar' },
  { value: 'my', label: '🇲🇾 Malaysia' },
  { value: 'mv', label: '🇲🇻 Maldives' },
  { value: 'ml', label: '🇲🇱 Mali' },
  { value: 'mt', label: '🇲🇹 Malta' },
  { value: 'mr', label: '🇲🇷 Mauritania' },
  { value: 'mu', label: '🇲🇺 Mauritius' },
  { value: 'mx', label: '🇲🇽 Mexico' },
  { value: 'md', label: '🇲🇩 Moldova' },
  { value: 'mc', label: '🇲🇨 Monaco' },
  { value: 'mn', label: '🇲🇳 Mongolia' },
  { value: 'me', label: '🇲🇪 Montenegro' },
  { value: 'ma', label: '🇲🇦 Morocco' },
  { value: 'mz', label: '🇲🇿 Mozambique' },
  { value: 'mm', label: '🇲🇲 Myanmar' },
  { value: 'na', label: '🇳🇦 Namibia' },
  { value: 'np', label: '🇳🇵 Nepal' },
  { value: 'nl', label: '🇳🇱 Netherlands' },
  { value: 'nz', label: '🇳🇿 New Zealand' },
  { value: 'ni', label: '🇳🇮 Nicaragua' },
  { value: 'ne', label: '🇳🇪 Niger' },
  { value: 'ng', label: '🇳🇬 Nigeria' },
  { value: 'mk', label: '🇲🇰 North Macedonia' },
  { value: 'no', label: '🇳🇴 Norway' },
  { value: 'om', label: '🇴🇲 Oman' },
  { value: 'pk', label: '🇵🇰 Pakistan' },
  { value: 'pa', label: '🇵🇦 Panama' },
  { value: 'pg', label: '🇵🇬 Papua New Guinea' },
  { value: 'py', label: '🇵🇾 Paraguay' },
  { value: 'pe', label: '🇵🇪 Peru' },
  { value: 'ph', label: '🇵🇭 Philippines' },
  { value: 'pl', label: '🇵🇱 Poland' },
  { value: 'pt', label: '🇵🇹 Portugal' },
  { value: 'qa', label: '🇶🇦 Qatar' },
  { value: 'ro', label: '🇷🇴 Romania' },
  { value: 'ru', label: '🇷🇺 Russia' },
  { value: 'rw', label: '🇷🇼 Rwanda' },
  { value: 'sa', label: '🇸🇦 Saudi Arabia' },
  { value: 'sn', label: '🇸🇳 Senegal' },
  { value: 'rs', label: '🇷🇸 Serbia' },
  { value: 'sg', label: '🇸🇬 Singapore' },
  { value: 'sk', label: '🇸🇰 Slovakia' },
  { value: 'si', label: '🇸🇮 Slovenia' },
  { value: 'so', label: '🇸🇴 Somalia' },
  { value: 'za', label: '🇿🇦 South Africa' },
  { value: 'ss', label: '🇸🇸 South Sudan' },
  { value: 'es', label: '🇪🇸 Spain' },
  { value: 'lk', label: '🇱🇰 Sri Lanka' },
  { value: 'sd', label: '🇸🇩 Sudan' },
  { value: 'sr', label: '🇸🇷 Suriname' },
  { value: 'se', label: '🇸🇪 Sweden' },
  { value: 'ch', label: '🇨🇭 Switzerland' },
  { value: 'sy', label: '🇸🇾 Syria' },
  { value: 'tw', label: '🇹🇼 Taiwan' },
  { value: 'tj', label: '🇹🇯 Tajikistan' },
  { value: 'tz', label: '🇹🇿 Tanzania' },
  { value: 'th', label: '🇹🇭 Thailand' },
  { value: 'tl', label: '🇹🇱 Timor-Leste' },
  { value: 'tg', label: '🇹🇬 Togo' },
  { value: 'tn', label: '🇹🇳 Tunisia' },
  { value: 'tr', label: '🇹🇷 Turkey' },
  { value: 'tm', label: '🇹🇲 Turkmenistan' },
  { value: 'ug', label: '🇺🇬 Uganda' },
  { value: 'ua', label: '🇺🇦 Ukraine' },
  { value: 'ae', label: '🇦🇪 United Arab Emirates' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'uy', label: '🇺🇾 Uruguay' },
  { value: 'uz', label: '🇺🇿 Uzbekistan' },
  { value: 've', label: '🇻🇪 Venezuela' },
  { value: 'vn', label: '🇻🇳 Vietnam' },
  { value: 'ye', label: '🇾🇪 Yemen' },
  { value: 'zm', label: '🇿🇲 Zambia' },
  { value: 'zw', label: '🇿🇼 Zimbabwe' },
];

class SbCountrySearch extends LitElement {
  @state() private _options = COUNTRIES;
  @state() private _value = '';

  #onSearch = (e: CustomEvent<{ query: string }>): void => {
    const q = e.detail.query.toLowerCase();
    this._options = q ? COUNTRIES.filter((c) => c.label.toLowerCase().includes(q)) : COUNTRIES;
  };

  #onChange = (e: CustomEvent<{ value: string }>): void => {
    this._value = e.detail.value;
  };

  override render() {
    return html`
      <ds-searchable-select
        label="Country"
        placeholder="Select a country"
        search-placeholder="Search countries…"
        .options=${this._options}
        .value=${this._value}
        @ds-search=${this.#onSearch}
        @ds-change=${this.#onChange}
      >
        <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
      </ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-country-search')) {
  customElements.define('sb-country-search', SbCountrySearch);
}

const DISCIPLINES: SelectOption[] = [
  { label: 'Design', value: 'design', icon: { name: 'paint-brush', color: '#db2777' } },
  { label: 'Engineering', value: 'engineering', icon: { name: 'wrench', color: '#2563eb' } },
  { label: 'Product', value: 'product', icon: { name: 'cube', color: '#7c3aed' } },
  { label: 'Operations', value: 'ops', disabled: true, icon: { name: 'cog-6-tooth', color: '#0891b2' } },
];

class SbDisciplineSearch extends LitElement {
  @state() private _options = DISCIPLINES;
  @state() private _value = '';

  #onSearch = (e: CustomEvent<{ query: string }>): void => {
    const q = e.detail.query.toLowerCase();
    this._options = q ? DISCIPLINES.filter((d) => d.label.toLowerCase().includes(q)) : DISCIPLINES;
  };

  #onChange = (e: CustomEvent<{ value: string }>): void => {
    this._value = e.detail.value;
  };

  override render() {
    return html`
      <ds-searchable-select
        label="Discipline"
        placeholder="Pick a discipline"
        search-placeholder="Search disciplines…"
        .options=${this._options}
        .value=${this._value}
        @ds-search=${this.#onSearch}
        @ds-change=${this.#onChange}
      >
        <ds-icon slot="leading" name="squares-2x2"></ds-icon>
      </ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-discipline-search')) {
  customElements.define('sb-discipline-search', SbDisciplineSearch);
}

const DISCIPLINE_SOURCE = `import '@jsekulowicz/ds-components/searchable-select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/squares-2x2';
import '@jsekulowicz/ds-components/icon/paint-brush';
import '@jsekulowicz/ds-components/icon/wrench';
import '@jsekulowicz/ds-components/icon/cube';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';

const DISCIPLINES = [
  { label: 'Design', value: 'design', icon: { name: 'paint-brush', color: '#db2777' } },
  { label: 'Engineering', value: 'engineering', icon: { name: 'wrench', color: '#2563eb' } },
  { label: 'Product', value: 'product', icon: { name: 'cube', color: '#7c3aed' } },
  { label: 'Operations', value: 'ops', disabled: true, icon: { name: 'cog-6-tooth', color: '#0891b2' } },
];

// ds-searchable-select emits ds-search on every keystroke; the consumer owns filtering.
let options = DISCIPLINES;
function onSearch(e) {
  const q = e.detail.query.toLowerCase();
  options = q ? DISCIPLINES.filter((d) => d.label.toLowerCase().includes(q)) : DISCIPLINES;
}

html\`
  <ds-searchable-select
    label="Discipline"
    placeholder="Pick a discipline"
    search-placeholder="Search disciplines…"
    .options=\${options}
    @ds-search=\${onSearch}
    @ds-change=\${(e) => (value = e.detail.value)}
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-searchable-select>
\`;`;

const COUNTRY_SOURCE = `import '@jsekulowicz/ds-components/searchable-select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/magnifying-glass';

const COUNTRIES = [
  { value: 'af', label: '🇦🇫 Afghanistan' },
  { value: 'al', label: '🇦🇱 Albania' },
  // …160+ countries
  { value: 'us', label: '🇺🇸 United States' },
];

let options = COUNTRIES;
function onSearch(e) {
  const q = e.detail.query.toLowerCase();
  options = q ? COUNTRIES.filter((c) => c.label.toLowerCase().includes(q)) : COUNTRIES;
}

html\`
  <ds-searchable-select
    label="Country"
    placeholder="Select a country"
    search-placeholder="Search countries…"
    .options=\${options}
    @ds-search=\${onSearch}
    @ds-change=\${(e) => (value = e.detail.value)}
  >
    <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
  </ds-searchable-select>
\`;`;

const meta: Meta = {
  title: 'Atoms/SearchableSelect',
  component: 'ds-searchable-select',
  decorators: [(story) => html`<div style="padding: 4px 6px;">${story()}</div>`],
  parameters: {
    docs: {
      story: { height: '330px' },
    },
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    clearable: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    label: 'Discipline',
    description: '',
    error: 'Please select a discipline.',
    placeholder: 'Pick a discipline',
    searchPlaceholder: 'Search disciplines…',
    size: 'md',
    disabled: false,
    required: false,
    invalid: false,
    clearable: false,
    loading: false,
  },
};

export default meta;
type Story = StoryObj;

export const Disciplines: Story = {
  name: 'Pick a discipline (with search + icons)',
  parameters: {
    docs: {
      story: { height: '270px' },
      source: { code: DISCIPLINE_SOURCE },
    },
  },
  render: () => html`<sb-discipline-search></sb-discipline-search>`,
};

export const Playground: Story = {
  parameters: {
    docs: {
      story: { height: '270px' },
      source: { code: DISCIPLINE_SOURCE },
    },
  },
  render: (args) => html`
    <ds-searchable-select
      label=${args['label']}
      description=${args['description'] || ''}
      error=${args['error'] || ''}
      placeholder=${args['placeholder']}
      search-placeholder=${args['searchPlaceholder']}
      size=${args['size']}
      ?disabled=${args['disabled']}
      ?required=${args['required']}
      ?invalid=${args['invalid']}
      ?clearable=${args['clearable']}
      ?loading=${args['loading']}
      .options=${DISCIPLINES}
      @ds-search=${(e: CustomEvent<{ query: string }>) => {
        const q = e.detail.query.toLowerCase();
        (e.currentTarget as HTMLElement & { options: SelectOption[] }).options = q
          ? DISCIPLINES.filter((d) => d.label.toLowerCase().includes(q))
          : DISCIPLINES;
      }}
    >
      <ds-icon slot="leading" name="squares-2x2"></ds-icon>
    </ds-searchable-select>
  `,
};

export const Countries: Story = {
  name: 'Countries (virtualized, 160+ items)',
  parameters: { docs: { source: { code: COUNTRY_SOURCE } } },
  render: () => html`<sb-country-search></sb-country-search>`,
};

export const Loading: Story = {
  parameters: {
    docs: {
      story: { height: '80px' },
      source: {
        code: `html\`
  <ds-searchable-select label="Country" placeholder="Loading options…" loading>
    <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
  </ds-searchable-select>
\`;`,
      },
    },
  },
  render: () => html`
    <ds-searchable-select label="Country" placeholder="Loading options…" ?loading=${true}>
      <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
    </ds-searchable-select>
  `,
};

class SbCountryMultiSearch extends LitElement {
  @state() private _options = COUNTRIES;
  @state() private _values: string[] = [];

  #onSearch = (e: CustomEvent<{ query: string }>): void => {
    const q = e.detail.query.toLowerCase();
    this._options = q ? COUNTRIES.filter((c) => c.label.toLowerCase().includes(q)) : COUNTRIES;
  };

  #onChange = (e: CustomEvent<{ values: string[] }>): void => {
    this._values = e.detail.values;
  };

  override render() {
    return html`
      <ds-searchable-select
        label="Countries"
        placeholder="Select countries"
        search-placeholder="Search countries…"
        ?multiple=${true}
        .maxLines=${2}
        .options=${this._options}
        .values=${this._values}
        @ds-search=${this.#onSearch}
        @ds-change=${this.#onChange}
      >
        <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
      </ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-country-multi-search')) {
  customElements.define('sb-country-multi-search', SbCountryMultiSearch);
}

class SbRequiredDisciplineSearch extends LitElement {
  @state() private _options = DISCIPLINES;
  @state() private _value = 'engineering';

  #onSearch = (e: CustomEvent<{ query: string }>): void => {
    const q = e.detail.query.toLowerCase();
    this._options = q ? DISCIPLINES.filter((d) => d.label.toLowerCase().includes(q)) : DISCIPLINES;
  };

  #onChange = (e: CustomEvent<{ value: string }>): void => {
    this._value = e.detail.value;
  };

  override render() {
    return html`
      <ds-searchable-select
        label="Discipline"
        placeholder="Pick a discipline"
        search-placeholder="Search disciplines…"
        description="This field is required."
        ?required=${true}
        .options=${this._options}
        .value=${this._value}
        @ds-search=${this.#onSearch}
        @ds-change=${this.#onChange}
      >
        <ds-icon slot="leading" name="squares-2x2"></ds-icon>
      </ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-required-discipline-search')) {
  customElements.define('sb-required-discipline-search', SbRequiredDisciplineSearch);
}

export const Required: Story = {
  parameters: {
    docs: {
      story: { height: '270px' },
      source: {
        code: DISCIPLINE_SOURCE.replace(
          'let options = DISCIPLINES;',
          "let value = 'engineering';\nlet options = DISCIPLINES;",
        )
          .replace(
            '    search-placeholder="Search disciplines…"',
            '    search-placeholder="Search disciplines…"\n    description="This field is required."\n    required',
          )
          .replace('    @ds-search=', '    .value=${value}\n    @ds-search='),
      },
    },
  },
  render: () => html`<sb-required-discipline-search></sb-required-discipline-search>`,
};

export const MultipleCountries: Story = {
  name: 'Multiple — Countries (maxLines=2)',
  parameters: {
    docs: {
      story: { height: '330px' },
      source: {
        code: `${COUNTRY_SOURCE.split('html`')[0]}let values = [];

html\`
  <ds-searchable-select
    label="Countries"
    placeholder="Select countries"
    search-placeholder="Search countries…"
    multiple
    .maxLines=\${2}
    .options=\${options}
    .values=\${values}
    @ds-search=\${onSearch}
    @ds-change=\${(e) => (values = e.detail.values)}
  >
    <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
  </ds-searchable-select>
\`;`,
      },
    },
  },
  render: () => html`<sb-country-multi-search></sb-country-multi-search>`,
};
