import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { SelectOption } from '@ds/components/select';
import '@ds/components/searchable-select/define';

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
    this._options = q
      ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q))
      : COUNTRIES;
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
      ></ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-country-search')) {
  customElements.define('sb-country-search', SbCountrySearch);
}

const meta: Meta = {
  title: 'Atoms/SearchableSelect',
  component: 'ds-searchable-select',
  tags: ['autodocs'],
  decorators: [(story) => html`<div style="padding: 4px 6px;">${story()}</div>`],
  parameters: {
    docs: {
      story: { height: '360px' },
    },
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
  args: {
    label: 'Framework',
    description: '',
    error: 'Please select an option.',
    placeholder: 'Select a framework',
    searchPlaceholder: 'Search…',
    disabled: false,
    required: false,
    invalid: false,
    clearable: false,
  },
};

export default meta;
type Story = StoryObj;

export const Countries: Story = {
  name: 'Countries (virtualized, 160+ items)',
  render: () => html`<sb-country-search></sb-country-search>`,
};

class SbCountryMultiSearch extends LitElement {
  @state() private _options = COUNTRIES;
  @state() private _values: string[] = [];

  #onSearch = (e: CustomEvent<{ query: string }>): void => {
    const q = e.detail.query.toLowerCase();
    this._options = q
      ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q))
      : COUNTRIES;
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
      ></ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-country-multi-search')) {
  customElements.define('sb-country-multi-search', SbCountryMultiSearch);
}

const FRAMEWORKS: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'Solid' },
];

class SbRequiredFrameworkSearch extends LitElement {
  @state() private _options = FRAMEWORKS;
  @state() private _value = 'react';

  #onSearch = (e: CustomEvent<{ query: string }>): void => {
    const q = e.detail.query.toLowerCase();
    this._options = q ? FRAMEWORKS.filter(f => f.label.toLowerCase().includes(q)) : FRAMEWORKS;
  };

  #onChange = (e: CustomEvent<{ value: string }>): void => {
    this._value = e.detail.value;
  };

  override render() {
    return html`
      <ds-searchable-select
        label="Framework"
        placeholder="Select a framework"
        search-placeholder="Search frameworks…"
        description="This field is required."
        ?required=${true}
        .options=${this._options}
        .value=${this._value}
        @ds-search=${this.#onSearch}
        @ds-change=${this.#onChange}
      ></ds-searchable-select>
    `;
  }
}

if (!customElements.get('sb-required-framework-search')) {
  customElements.define('sb-required-framework-search', SbRequiredFrameworkSearch);
}

export const Required: Story = {
  render: () => html`<sb-required-framework-search></sb-required-framework-search>`,
};

export const MultipleCountries: Story = {
  name: 'Multiple — Countries (maxLines=2)',
  parameters: { docs: { story: { height: '420px' } } },
  render: () => html`<sb-country-multi-search></sb-country-multi-search>`,
};
