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


    const headerClass = computed(() => {
      return props.variant === 'knockout'
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
@use '@/assets/styles/common/variables' as *;

.program-preview__text-block {
  max-width: 44rem;
  overflow: hidden;
}

.program-preview__text-block-copy {
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

.program-preview__text-block--default {
  padding: 2rem;
  background: rgba($white, 0.88);
  box-shadow: 0 20px 40px rgba($black, 0.06);
}

.program-preview__text-block--knockout {
  padding: 2.5rem;
  background: linear-gradient(135deg, $magenta, $black);
  color: $white;
  margin: 1rem -1rem;

  .program-preview__kicker {
    color: rgba($white, 0.78);
  }

  h2 {
    margin-bottom: 0.5rem;
    font-size: clamp(2.4rem, 6vw, 4rem);
  }
}

.program-preview__text-block--knockout.program-preview__text-block--with-image {
  display: grid;
  grid-template-columns: minmax(12rem, 17rem) minmax(0, 1fr);
  max-width: 62rem;
  padding: 0;

  .program-preview__text-block-media {
    min-height: 100%;
  }

  .program-preview__text-block-copy {
    padding: 2.5rem;
  }
}

@media (max-width: 900px) {
  .program-preview__text-block--knockout.program-preview__text-block--with-image {
    grid-template-columns: 1fr;

    .program-preview__text-block-media {
      max-height: 16rem;
    }

    .program-preview__text-block-copy {
      padding: 1.5rem;
    }
  }
}
</style>
