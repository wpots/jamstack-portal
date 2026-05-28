<template>
  <AppRatingItem
    v-if="singleSong"
    class="program-set__song"
    :interactive="isVotingOpen"
    :song="getRatingSong(singleSong)"
  >
    <ProgramSongCard :song="singleSong" tag="div" tone="tone-0" />
  </AppRatingItem>

  <div v-else class="program-set__song-grid">
    <AppRatingItem
      v-for="(song, index) in songs"
      :key="song.linkedScore?.sys?.id || `${song.title}-${index}`"
      class="program-set__song"
      :interactive="isVotingOpen"
      :song="getRatingSong(song)"
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
import { useFeedbackAvailability } from '@/composables/useFeedback/availability';
import type { LinkedScore } from '@/composables/useContent/program.types';

interface ProgramSongGridItem {
  title: string;
  artist?: string;
  imageUrl?: string;
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
    const { isVotingOpen } = useFeedbackAvailability();
    const singleSong = computed<ProgramSongGridItem | undefined>(() =>
      props.songs.length === 1 ? props.songs[0] : undefined,
    );

    const getRatingSong = (song: ProgramSongGridItem): LinkedScore => {
      return {
        albumart: song.linkedScore?.albumart || (song.imageUrl ? { url: song.imageUrl } : undefined),
        artist: song.linkedScore?.artist || song.artist,
        sys: song.linkedScore?.sys,
        title: song.linkedScore?.title || song.title,
      };
    };

    onMounted(async () => {
      if (!getSongRatings.value) {
        await fetchSongRatings();
      }
    });

    return { getRatingSong, isVotingOpen, singleSong };
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
    overflow-y: hidden;
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
