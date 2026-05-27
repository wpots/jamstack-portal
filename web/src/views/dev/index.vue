<template>
  <main class="preview-index">
    <section class="preview-index__hero container">
      <p class="preview-index__eyebrow">Dev previews</p>
      <h1>Preview routes</h1>
      <p>
        Snelle index voor lokale previewpagina’s. Gebruik deze pagina om tussen de verschillende
        concepten en fallbackvarianten te schakelen.
      </p>
    </section>

    <section class="preview-index__grid container" aria-label="Beschikbare previews">
      <article v-for="preview in previews" :key="preview.to" class="preview-index__card">
        <p class="preview-index__label">{{ preview.label }}</p>
        <h2>{{ preview.title }}</h2>
        <p>{{ preview.description }}</p>
        <router-link class="preview-index__link" :to="preview.to"> Open preview </router-link>
      </article>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface PreviewLink {
  label: string;
  title: string;
  description: string;
  to: string;
}

export default defineComponent({
  name: 'PreviewIndexPage',
  setup() {
    const previews: PreviewLink[] = [
      {
        label: 'Concept',
        title: 'Program booklet',
        description:
          'Verticale preview van het nieuwe programma-boekje met dummy content voor double-impact.',
        to: '/__preview/program-booklet',
      },
      {
        label: 'Fallback',
        title: 'Legacy timetable',
        description:
          'Preview van het oude timetable-pad, gerenderd via de huidige legacy mapper en theming.',
        to: '/__preview/legacy-timetable',
      },
    ];

    return {
      previews,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.preview-index {
  min-height: 100vh;
  padding: 3rem 0 4rem;
  background: linear-gradient(180deg, $white 0%, $smoke 100%);
}

.preview-index__hero {
  max-width: 48rem;
  margin-bottom: 2rem;
}

.preview-index__eyebrow {
  margin-bottom: 0.5rem;
  color: $magenta;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.preview-index__hero h1 {
  margin-bottom: 0.75rem;
}

.preview-index__hero p:last-child {
  margin-bottom: 0;
}

.preview-index__grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}

.preview-index__card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba($black, 0.08);
  border-radius: 1rem;
  background: rgba($white, 0.92);
  box-shadow: 0 16px 32px rgba($black, 0.08);
}

.preview-index__label {
  margin-bottom: 0;
  color: $gray;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-index__card h2 {
  margin-bottom: 0;
}

.preview-index__card p {
  margin-bottom: 0;
}

.preview-index__link {
  display: inline-flex;
  width: fit-content;
  margin-top: auto;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: $magenta;
  color: $white;
  font-weight: 700;
  text-decoration: none;
}

.preview-index__link:focus-visible,
.preview-index__link:hover {
  background: $tundora;
}
</style>
