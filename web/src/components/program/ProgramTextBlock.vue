<template>
  <article
    class="program-preview__text-block"
    :class="[
      `program-preview__text-block--${variant}`,
      { 'program-preview__text-block--with-image': hasImage },
    ]"
  >
    <div v-if="hasImage" class="program-preview__text-block-media">
      <img :src="imageSrc" :alt="mediaAlt" class="program-preview__text-block-image" />
    </div>
    <div class="program-preview__text-block-copy">
      <header v-if="kicker || title" :class="headerClass">
        <p v-if="kicker" class="kicker">{{ kicker }}</p>
        <h2 v-if="title" class="title-fancy">{{ title }}</h2>
      </header>
      <div v-if="normalizedDescriptions.length" class="program-preview__text-block-body">
        <p v-for="(item, index) in normalizedDescriptions" :key="`${title}-${index}`">
          {{ item }}
        </p>
      </div>
    </div>
    <div v-if="$slots.default" class="program-preview__text-block-extra">
      <slot />
    </div>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

type ProgramTextBlockVariant = 'default' | 'spotlight' | 'knockout';

export default defineComponent({
  name: 'ProgramTextBlock',
  props: {
    variant: {
      type: String as PropType<ProgramTextBlockVariant>,
      default: 'default',
      validator: (value: string) => ['default', 'spotlight', 'knockout'].includes(value),
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
    descriptions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    imageSrc: {
      type: String,
      default: '',
    },
    mediaAlt: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const isInverseVariant = computed(() => {
      return props.variant === 'spotlight';
    });

    const headerClass = computed(() => {
      return isInverseVariant.value
        ? 'program-section-header inverse'
        : 'program-section-header';
    });

    const hasImage = computed(() => Boolean(props.imageSrc));
    const normalizedDescriptions = computed(() => {
      if (props.descriptions.length > 0) {
        return props.descriptions.filter(Boolean);
      }

      return props.description ? [props.description] : [];
    });

    return {
      hasImage,
      normalizedDescriptions,
      headerClass,
    };
  },
});
</script>

<style lang="scss" scoped>
.program-preview__text-block {
  max-width: 44rem;
  overflow: hidden;
}

.program-preview__text-block-copy {
  position: relative;
  z-index: 1;
}

.program-preview__text-block-extra {
  position: relative;
  z-index: 1;
}

.program-preview__text-block-body {
  display: grid;
  gap: 0.85rem;

  > * {
    margin: 0;
    white-space: pre-wrap;
  }
}

.program-preview__text-block-media {
  position: relative;
  overflow: hidden;
}

.program-preview__text-block-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
