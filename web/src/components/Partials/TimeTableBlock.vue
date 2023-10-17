<template>
  <section class="section timetableblock">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 program">
          <h2>{{ cms.pageTitle }}</h2>
          <div class="legenda" @click="handleLegend">
            <svg class="icon-help"><use href="#icon-help"></use></svg>
          </div>
        </div>
        <div class="col-12 soundwave scroll-snapping" ref="soundwave">
          <p v-show="showHints" ref="hints" class="hint">
            <svg class="icon-gesture gesture-swipe-right"><use href="#icon-gesture"></use></svg>
          </p>

          <ContentfulRichText :document="cms.intro" class="intermezzo" />

          <SetList v-if="cms.firstSetlist?.length > 0" :set="cms.firstSetlist" />
          <ContentfulRichText :document="cms.intermezzoRte" class="intermezzo" />

          <SetList v-if="cms.lastSetlist?.length > 0" :set="cms.lastSetlist" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated, onMounted } from 'vue';
import SetList from '../SetList.vue';
import ContentfulRichText from '../ContentfulRichText.vue';

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: 'TimeTableBlock',
  components: { SetList, ContentfulRichText },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const soundwave = ref<HTMLElement | null>(null);
    const hints = ref<HTMLElement | null>(null);
    const showHints = ref(true);
    const hintDelay = ref(0);
    onUpdated(() => {
      if (soundwave.value) {
        const soundwaveElements = soundwave.value.getElementsByClassName('wave');
        const arrayFromElems = Array.from(soundwaveElements);
        arrayFromElems.forEach((el, idx) => {
          if (idx === 0) {
            el.classList.add('colorWave');
          }

          el.addEventListener('animationiteration', () => {
            const nextEl = arrayFromElems[idx + 1];
            nextEl.classList.add('colorWave');
          });
        });
      }
    });
    onMounted(() => {
      if (hints.value) {
        hints.value.addEventListener('animationiteration', () => {
          hintDelay.value++;
          if (hintDelay.value >= 5) showHints.value = false;
        });
      }
    });
    const handleLegend = () => {
      hintDelay.value = 0;
      showHints.value = true;
    };
    return { soundwave, hints, showHints, handleLegend };
  },
});
</script>
<style lang="scss">
.section {
  margin-top: -70px;
}
.program {
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
.intermezzo {
  display: flex;
  min-width: 100vw;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  text-align: center;
  background-color: $smoke;

  h4 {
    font-family: 'Satisfy';
    font-size: 2rem;
  }
  ul {
    margin-top: 1rem;
    text-align: left;
  }
}

.hint {
  position: absolute;
  z-index: 100;
  bottom: 2rem;
  right: 1rem;
  font-style: italic;
  text-align: right;
}
.legenda {
  position: absolute;
  z-index: 100;
  background: $magenta;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  top: 0;
  right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 1rem;
    height: 1rem;
    fill: white;
  }
}
</style>
