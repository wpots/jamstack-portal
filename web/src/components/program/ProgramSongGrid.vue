<template>
  <div class="program-preview__song-grid">
    <AppRatingItem
      v-for="(song, index) in songs"
      :key="song.linkedScore?.sys?.id || `${song.title}-${index}`"
      :song="song.linkedScore"
      class="program-preview__song-card"
      variant="program-preview"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';
import AppRatingItem from '@/components/AppRatingItem.vue';
import { useFeedback } from '@/composables/useFeedback';
import type { LinkedScore } from '@/composables/useContent/program.types';

interface ProgramSongGridItem {
  title: string;
  linkedScore: LinkedScore;
}

export default defineComponent({
  name: 'ProgramSongGrid',
  components: {
    AppRatingItem,
  },
  props: {
    shortLabel: {
      type: String,
      default: '',
    },
    songs: {
      type: Array as PropType<ProgramSongGridItem[]>,
      default: () => [],
    },
  },
  setup() {
    const { fetchSongRatings, getSongRatings } = useFeedback();

    onMounted(async () => {
      if (!getSongRatings.value) {
        await fetchSongRatings();
      }
    });

    return {};
  },
});
</script>

<style lang="scss" scoped>
.program-preview__song-grid {
  display: grid;
  gap: 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 900px) {
  .program-preview__song-grid {
    gap: 0.7rem;
  }
}
</style>
