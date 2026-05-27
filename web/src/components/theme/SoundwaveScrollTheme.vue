<template>
  <div class="soundwave-theme">
    <button
      type="button"
      class="soundwave-theme__legend"
      @click="handleLegend"
      aria-label="Toon hints"
    >
      <svg class="icon-help"><use href="#icon-help"></use></svg>
    </button>

    <div ref="soundwave" class="soundwave-theme__content soundwave scroll-snapping">
      <p v-show="showHints" ref="hints" class="soundwave-theme__hint">
        <svg class="icon-gesture gesture-swipe-right"><use href="#icon-gesture"></use></svg>
      </p>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue';

export default defineComponent({
  name: 'SoundwaveScrollTheme',
  setup() {
    const soundwave = ref<HTMLElement | null>(null);
    const hints = ref<HTMLElement | null>(null);
    const showHints = ref(true);
    const hintDelay = ref(0);

    const registerWaveAnimations = () => {
      if (!soundwave.value) {
        return;
      }

      const waveElements = Array.from(soundwave.value.getElementsByClassName('wave'));

      waveElements.forEach((element, index) => {
        if (!(element instanceof HTMLElement)) {
          return;
        }

        if (index === 0) {
          element.classList.add('colorWave');
        }

        if (element.dataset.waveAnimationRegistered === 'true') {
          return;
        }

        element.dataset.waveAnimationRegistered = 'true';
        element.addEventListener('animationiteration', () => {
          const nextElement = waveElements[index + 1];

          if (nextElement instanceof HTMLElement) {
            nextElement.classList.add('colorWave');
          }
        });
      });
    };

    onUpdated(() => {
      registerWaveAnimations();
    });

    onMounted(() => {
      registerWaveAnimations();

      if (hints.value) {
        hints.value.addEventListener('animationiteration', () => {
          hintDelay.value += 1;

          if (hintDelay.value >= 5) {
            showHints.value = false;
          }
        });
      }
    });

    const handleLegend = () => {
      hintDelay.value = 0;
      showHints.value = true;
    };

    return { handleLegend, hints, showHints, soundwave };
  },
});
</script>

<style lang="scss">
@use '@/assets/styles/common/variables' as *;

.soundwave-theme {
  position: relative;
}

.soundwave {
  display: flex;
  flex-flow: row nowrap;
  padding-top: 2rem;
  overflow-y: initial;
  overflow-x: scroll;
}

.scroll-snapping {
  scroll-snap-type: x mandatory;

  & > ul,
  & > div {
    scroll-snap-align: start;
  }

  & > ul:last-child {
    padding-right: 50vw;
  }
}

.soundwave-theme__hint {
  position: absolute;
  z-index: 100;
  right: 1rem;
  bottom: 2rem;
  font-style: italic;
  text-align: right;
}

.soundwave-theme__legend {
  position: absolute;
  z-index: 100;
  top: 0;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: $magenta;
  color: white;

  svg {
    width: 1rem;
    height: 1rem;
    fill: white;
  }
}
</style>
