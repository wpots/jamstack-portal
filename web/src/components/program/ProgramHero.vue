<template>
  <div class="program-hero">
    <div class="program-hero__copy container-fluid">
      <p v-if="eyebrow" class="program-hero__eyebrow">
        {{ eyebrow }}
      </p>
      <h1>{{ title }}</h1>
      <p v-if="lede" class="program-hero__lede">
        {{ lede }}
      </p>
      <ProgramMeta v-if="metaItems.length" :items="metaItems" class="program-hero__meta" />
    </div>

    <img
      class="program-hero__confetti"
      src="/img/concerts/2026DuoConcert%20confetti.svg"
      alt=""
      aria-hidden="true"
    />

    <img
      class="program-hero__waves program-hero__waves--back"
      src="/img/concerts/2026DuoConcert%20waves.svg"
      alt=""
      aria-hidden="true"
    />

    <img
      class="program-hero__waves program-hero__waves--front"
      src="/img/concerts/2026DuoConcert%20waves2.svg"
      alt=""
      aria-hidden="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ProgramMeta, { ProgramMetaItem } from './ProgramMeta.vue';

export default defineComponent({
  name: 'ProgramHero',
  components: {
    ProgramMeta,
  },
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
    metaItems: {
      type: Array as PropType<ProgramMetaItem[]>,
      default: () => [],
    },
  },
});
</script>

<style lang="scss">
@use '@/assets/styles/common/variables' as *;
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700&display=swap');

.program-hero {
  position: relative;
  padding: 2rem 0 4rem;
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

.program-hero__confetti,
.program-hero__waves {
  display: none;
}

.program-hero__eyebrow {
  text-transform: uppercase;
}

.program-hero__lede {
  max-width: 42rem;
  margin-bottom: 2rem;
  font-size: 1.15rem;
  text-shadow: 0 6px 18px rgba($black, 0.35);
}

.program-hero__meta {
  position: relative;
  z-index: 1;
  width: min(100%, 62rem);
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
    max-width: 22rem;
    font-size: 0.875rem;
  }

  .program-hero__meta {
    width: 100%;
  }
}
</style>
