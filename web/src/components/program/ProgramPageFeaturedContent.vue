<template>
  <article class="program-featured-content">
    <p v-if="label" class="program-featured-content__label">{{ label }}</p>
    <h3 class="program-featured-content__title">{{ title }}</h3>
    <p v-if="description" class="program-featured-content__description">
      {{ description }}
    </p>
    <a
      v-if="hasCta"
      class="program-featured-content__link"
      :href="ctaUrl"
      :target="linkTarget"
      :rel="linkRel"
      :aria-label="linkAriaLabel"
    >
      <span>{{ ctaLabel }}</span>
      <span aria-hidden="true">↗</span>
    </a>
  </article>
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
    const ctaLabel = computed(() => props.ctaText || 'Meer informatie');
    const linkTarget = computed(() => (isExternal.value ? '_blank' : undefined));
    const linkRel = computed(() => (isExternal.value ? 'noopener noreferrer' : undefined));
    const linkAriaLabel = computed(() => {
      const destination = props.title ? ` ${props.title}` : '';

      return `${ctaLabel.value}${destination}`;
    });

    return {
      ctaLabel,
      hasCta,
      linkAriaLabel,
      linkRel,
      linkTarget,
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
  padding: 1.35rem;
  overflow: hidden;
  background: linear-gradient(160deg, rgba($white, 0.98), rgba($magenta, 0.08));
  box-shadow: 0 20px 40px rgba($black, 0.08);
  border: 1px solid rgba($black, 0.08);
  border-radius: 1.25rem;
}

.program-featured-content::after {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 0.35rem;
  background: linear-gradient(90deg, $magenta, $green-alt);
}

.program-featured-content__label {
  margin: 0;
  color: var(--program-color-accent);
  font-family: var(--program-font-display);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.program-featured-content__title {
  margin: 0;
  font-family: var(--program-font-display);
  font-size: clamp(1.45rem, 3vw, 1.85rem);
  line-height: 0.95;
}

.program-featured-content__description {
  margin: 0;
  line-height: 1.5;
}

.program-featured-content__link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.55rem;
  margin-top: auto;
  padding: 0.75rem 1rem;
  color: $white;
  font-family: var(--program-font-display);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
  background: linear-gradient(135deg, $black, $magenta);
  border-radius: 999px;
}

.program-featured-content__link:hover,
.program-featured-content__link:focus-visible {
  color: $white;
  box-shadow: 0 0 0 3px rgba($magenta, 0.18);
}
</style>
