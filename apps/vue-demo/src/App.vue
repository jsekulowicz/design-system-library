<script setup lang="ts">
import { ref } from 'vue';

const submitted = ref<Record<string, FormDataEntryValue> | null>(null);

function onSubmit(event: CustomEvent<{ data: FormData }>) {
  submitted.value = Object.fromEntries(event.detail.data.entries());
}
</script>

<template>
  <main
    :style="{
      maxWidth: '560px',
      margin: 'var(--ds-space-12) auto',
      padding: 'var(--ds-space-6)',
      display: 'grid',
      gap: 'var(--ds-space-6)',
    }"
  >
    <header style="display:grid;gap:var(--ds-space-2)">
      <span style="font-family:var(--ds-font-body);color:var(--ds-color-fg-muted)"
        >@ds/components · Vue 3</span
      >
      <h1
        style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0"
      >
        Same web components, Vue bindings.
      </h1>
    </header>

    <ds-form summary="New invoice" @ds-submit="onSubmit">
      <ds-field label="Client">
        <ds-text-field name="client" required></ds-text-field>
      </ds-field>
      <ds-field label="Amount (PLN)">
        <ds-text-field name="amount" type="number" required></ds-text-field>
      </ds-field>
      <ds-checkbox name="priority">Flag as priority</ds-checkbox>
      <div slot="actions">
        <ds-button variant="ghost" type="reset">Reset</ds-button>
        <ds-button variant="primary" type="submit">Issue</ds-button>
      </div>
    </ds-form>

    <pre
      v-if="submitted"
      style="font-family:var(--ds-font-mono);background:var(--ds-color-bg-subtle);padding:var(--ds-space-4);border-radius:var(--ds-radius-sm);margin:0"
    >{{ JSON.stringify(submitted, null, 2) }}</pre>
  </main>
</template>
