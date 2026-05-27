<template>
  <div
    :class="[
      'program-hero',
      { 'program-preview__hero': isDoubleImpactTheme },
    ]"
  >
    <div
      :class="[
        'program-hero__copy',
        'container-fluid',
        { 'program-preview__hero-content': isDoubleImpactTheme },
      ]"
    >
      <p
        v-if="eyebrow"
        :class="[
          'program-hero__eyebrow',
          { 'program-preview__eyebrow': isDoubleImpactTheme },
        ]"
      >
        {{ eyebrow }}
      </p>
      <h1>{{ title }}</h1>
      <p
        v-if="lede"
        :class="[
          'program-hero__lede',
          { 'program-preview__lede': isDoubleImpactTheme },
        ]"
      >
        {{ lede }}
      </p>
    </div>

    <img
      v-if="isDoubleImpactTheme"
      :class="[
        'program-hero__confetti',
        { 'program-preview__confetti': isDoubleImpactTheme },
      ]"
      src="/img/concerts/2026DuoConcert%20confetti.svg"
      alt=""
      aria-hidden="true"
    />

    <img
      v-if="isDoubleImpactTheme"
      :class="[
        'program-hero__waves',
        'program-hero__waves--back',
        'program-preview__waves',
        'program-preview__waves--back',
      ]"
      src="/img/concerts/2026DuoConcert%20waves.svg"
      alt=""
      aria-hidden="true"
    />

    <img
      v-if="isDoubleImpactTheme"
      :class="[
        'program-hero__waves',
        'program-hero__waves--front',
        'program-preview__waves',
        'program-preview__waves--front',
      ]"
      src="/img/concerts/2026DuoConcert%20waves2.svg"
      alt=""
      aria-hidden="true"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgramHero',
  props: {
    title: {
      type: String,
      default: '',
    },
    eyebrow: {
      type: String,
      default: '',
    },
    lede: {
      type: String,
      default: '',
    },
    themeSlug: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const isDoubleImpactTheme = computed(() => props.themeSlug === 'double-impact');

    return { isDoubleImpactTheme };
  },
});
</script>

<style lang="scss">
@use '@/assets/styles/common/variables' as *;

.program-hero {
  position: relative;
  padding: 8rem 0 4rem;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 77, 157, 0.22), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(59, 236, 168, 0.18), transparent 22%),
    linear-gradient(160deg, #140812 0%, #2a1322 54%, #120e1d 100%);
  color: $white;
  overflow: hidden;
}
.program-hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 7rem;
  background: linear-gradient(180deg, transparent, rgba($black, 0.65));
  pointer-events: none;
}
.program-hero__copy {
  position: relative;
  z-index: 1;
  max-width: 70rem;
}

.program-hero__eyebrow {
  margin-bottom: 0.5rem;
  color: var(--program-color-accent, #{$magenta});
  font-family: var(--program-font-display, #{$font-fam-heading});
  font-size: 0.95rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.program-hero h1 {
  max-width: 10ch;
  margin-bottom: 1rem;
  font-family: var(--program-font-title);
  font-weight: 400;
  text-shadow: 0 12px 30px rgba($black, 0.4);
  font-size: clamp(3.1rem, 8vw, 6.3rem);
  line-height: 0.88;
  letter-spacing: -0.03em;
}

.program-hero__lede {
  max-width: 42rem;
  margin-bottom: 2rem;
  font-size: 1.15rem;
  text-shadow: 0 6px 18px rgba($black, 0.35);
}

@media (max-width: 767px) {
  .program-hero {
    min-height: 20rem;
    padding: 3.5rem 1rem 6rem;
  }

  .program-hero__copy {
    padding-right: min(6rem, 18vw);
  }

  .program-hero__lede {
    max-width: 16rem;
    font-size: 0.92rem;
  }
}
</style>
