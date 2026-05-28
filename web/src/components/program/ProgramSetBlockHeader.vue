<template>
  <header class="program-preview__section-header">
    <div>
      <p class="program-preview__kicker">{{ kicker }}</p>
      <h2>{{ title }}</h2>
    </div>
    <div class="program-preview__section-note">
      <p>{{ description }}</p>
      <small v-if="note">{{ note }}</small>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgramSetBlockHeader',
  props: {
    kicker: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-preview__section-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 26rem);
  gap: 2rem;
  align-items: end;
  margin-bottom: 1.5rem;

  h2 {
    font-family: var(--program-font-display);
  }
}

.program-preview__section-note {
  margin-bottom: 0;
  color: rgba($tundora, 0.8);

  p,
  small {
    margin: 0;
  }

  small {
    display: block;
    margin-top: 0.4rem;
    color: rgba($tundora, 0.65);
  }
}

@media (max-width: 900px) {
  .program-preview__section-header {
    grid-template-columns: 1fr;
  }
}
</style>
