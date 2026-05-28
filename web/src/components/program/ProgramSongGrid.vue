<template>
  <AppRatingItem v-if="singleSong" class="program-set__song" :song="singleSong.linkedScore">
    <ProgramSongCard :song="singleSong" tag="div" tone="tone-0" />
  </AppRatingItem>

  <div v-else class="program-set__song-grid">
    <AppRatingItem
      v-for="(song, index) in songs"
      :key="song.linkedScore?.sys?.id || `${song.title}-${index}`"
      class="program-set__song"
      :song="song.linkedScore"
    >
      <ProgramSongCard :song="song" tag="div" :tone="`tone-${index % 4}`" />
    </AppRatingItem>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from 'vue';
import AppRatingItem from '@/components/AppRatingItem.vue';
import ProgramSongCard from '@/components/program/ProgramSongCard.vue';
import { useFeedback } from '@/composables/useFeedback';
import type { LinkedScore } from '@/composables/useContent/program.types';

interface ProgramSongGridItem {
  title: string;
  artist?: string;
  linkedScore?: LinkedScore;
}

export default defineComponent({
  name: 'ProgramSongGrid',
  components: { AppRatingItem, ProgramSongCard },
  props: {
    songs: { type: Array as PropType<ProgramSongGridItem[]>, default: () => [] },
  },
  setup(props) {
    const { fetchSongRatings, getSongRatings } = useFeedback();
    const singleSong = computed<ProgramSongGridItem | undefined>(() =>
      props.songs.length === 1 ? props.songs[0] : undefined,
    );

    onMounted(async () => {
      if (!getSongRatings.value) {
        await fetchSongRatings();
      }
    });

    return { singleSong };
  },
});
</script>
<style lang="scss" scoped>
.program-set__song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  align-items: stretch;
  gap: 0.9rem;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

:deep(.program-set__song) {
  min-width: 0;
}

@media (max-width: 900px) {
  .program-set__song-grid {
    display: flex;
    width: auto;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    margin-right: -1rem;
    padding-right: 1rem;
    padding-bottom: 0.5rem;
    scroll-padding-inline: 0 1rem;
    scroll-snap-type: x mandatory;
    gap: 0.7rem;
  }

  :deep(.program-set__song.rating-item) {
    flex: 0 0 min(13rem, calc(100vw - 4.5rem));
    width: min(13rem, calc(100vw - 4.5rem));
    max-width: min(13rem, calc(100vw - 4.5rem));
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
}
</style>
