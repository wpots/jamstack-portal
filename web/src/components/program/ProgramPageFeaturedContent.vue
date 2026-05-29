<template>
  <component
    :is="rootTag"
    class="program-featured-content"
    :href="hasCta ? ctaUrl : undefined"
    :target="hasCta ? linkTarget : undefined"
    :rel="hasCta ? linkRel : undefined"
    :aria-label="hasCta ? linkAriaLabel : undefined"
  >
    <h3 v-if="title" class="program-featured-content__title">{{ title }}</h3>
    <p v-if="displayCopy" class="program-featured-content__copy">
      {{ displayCopy }}
    </p>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

function isExternalUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export default defineComponent({
  name: 'ProgramPageFeaturedContent',
  props: {
    label: {
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
    ctaText: {
      type: String,
      default: '',
    },
    ctaUrl: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const hasCta = computed(() => Boolean(props.ctaUrl));
    const isExternal = computed(() => isExternalUrl(props.ctaUrl));
    const displayCopy = computed(() => props.ctaText || props.title);
    const rootTag = computed(() => (hasCta.value ? 'a' : 'article'));
    const linkTarget = computed(() => (isExternal.value ? '_blank' : undefined));
    const linkRel = computed(() => (isExternal.value ? 'noopener noreferrer' : undefined));
    const linkAriaLabel = computed(() => {
      if (props.title) {
        return props.title;
      }

      if (displayCopy.value) {
        return displayCopy.value;
      }

      return 'Meer informatie';
    });

    return {
      displayCopy,
      hasCta,
      linkAriaLabel,
      linkRel,
      linkTarget,
      rootTag,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-featured-content {
  position: relative;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.1rem 1.15rem 1rem;
  overflow: hidden;
  color: $white;
  background: rgba($white, 0.06);
  box-shadow: inset 0 1px 0 rgba($white, 0.08);
  border: 1px solid rgba($white, 0.1);
  border-radius: 0.9rem;
  text-decoration: none;
}

.program-featured-content::after {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 0.24rem;
  background: linear-gradient(90deg, rgba($yellow, 0.9), rgba($green, 0.72), rgba($green-alt, 0.9));
}

.program-featured-content__title {
  margin: 0;
  font-family: var(--program-font-title, var(--program-font-body));
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  font-weight: var(--program-font-weight-body-strong, 600);
  line-height: 1.1;
  max-width: 18ch;
}

.program-featured-content__copy {
  margin: auto 0 0;
  color: rgba($yellow, 0.92);
  font-family: var(--program-font-body);
  font-size: 0.77rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition:
    transform 160ms ease,
    color 160ms ease;
}

.program-featured-content:hover .program-featured-content__copy,
.program-featured-content:focus-visible .program-featured-content__copy {
  color: $white;
  transform: translateY(-1px);
}

.program-featured-content:focus-visible {
  outline: 2px solid rgba($yellow, 0.55);
  outline-offset: 0.2rem;
}

@media (max-width: 640px) {
  .program-featured-content {
    padding: 1rem 1rem 0.95rem;
  }

  .program-featured-content__title {
    font-size: 1.3rem;
  }
}
</style>
