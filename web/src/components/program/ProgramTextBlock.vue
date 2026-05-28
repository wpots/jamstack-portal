<template>
  <article class="program-preview__text-block" :class="`program-preview__text-block--${variant}`">
    <p v-if="kicker" class="program-preview__kicker">{{ kicker }}</p>
    <h2>{{ title }}</h2>
    <component :is="descriptionTag" v-if="description">{{ description }}</component>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

type ProgramTextBlockVariant = 'default' | 'knockout';

export default defineComponent({
  name: 'ProgramTextBlock',
  props: {
    variant: {
      type: String as PropType<ProgramTextBlockVariant>,
      default: 'default',
      validator: (value: string) => ['default', 'knockout'].includes(value),
    },
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
  },
  setup(props) {
    const descriptionTag = computed(() => {
      return props.variant === 'knockout' ? 'small' : 'p';
    });

    return {
      descriptionTag,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-preview__text-block {
  max-width: 44rem;

  h2 {
    font-family: var(--program-font-display);
  }
}

.program-preview__kicker {
  margin-bottom: 0.75rem;
  color: var(--program-color-accent);
  font-family: var(--program-font-display);
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.program-preview__text-block--default {
  padding: 2rem;
  background: rgba($white, 0.88);
  box-shadow: 0 20px 40px rgba($black, 0.06);
}

.program-preview__text-block--knockout {
  padding: 2.5rem;
  background: linear-gradient(135deg, $magenta, $black);
  color: $white;

  .program-preview__kicker {
    margin-bottom: 0.5rem;
    color: rgba($white, 0.78);
  }

  h2 {
    margin-bottom: 0.5rem;
    font-size: clamp(2.4rem, 6vw, 4rem);
  }
}
</style>
