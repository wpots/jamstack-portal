<template>
  <section :id="sectionId || undefined" class="program-set">
    <header v-if="kicker || title" class="program-section-header">
      <p v-if="kicker" class="kicker">{{ kicker }}</p>
      <h2 class="title">{{ title }}</h2>
    </header>

    <ProgramSongGrid :songs="songs" />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ProgramSongGrid from '@/components/program/ProgramSongGrid.vue';
import type { ProgramSongEntry } from '@/composables/useContent/program.types';

export default defineComponent({
  name: 'ProgramSetBlock',
  components: { ProgramSongGrid },
  props: {
    sectionId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    kicker: {
      type: String,
      default: '',
    },
    songs: {
      type: Array as PropType<ProgramSongEntry[]>,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
.program-set {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  padding: 2rem 1rem;
}
</style>
