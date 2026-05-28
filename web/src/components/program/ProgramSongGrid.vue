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
@use '@/assets/styles/common/variables' as *;

.program-set__song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

// :deep(.program-set__song-rating.rating-item) {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   width: 100%;
//   max-width: none;
//   padding: 0;
//   margin-top: 0;
//   overflow: hidden;
//   background: $white;
//   box-shadow: 0 16px 30px rgba($black, 0.08);
//   border-radius: 1rem;
// }

// :deep(.program-set__song-rating .rating-item__body) {
//   flex: 1 1 auto;
// }

// :deep(.program-set__song-rating .rating-item__footer) {
//   display: flex;
//   align-items: flex-end;
//   justify-content: space-between;
//   gap: 0.75rem;
//   padding: 0 0.85rem 0.85rem;
// }

// :deep(.program-set__song-rating .rating-summary) {
//   display: flex;
//   flex-direction: column;
//   gap: 0.25rem;
// }

// :deep(.program-set__song-rating .rating-item__action) {
//   flex: 0 0 auto;
//   align-self: center;
// }

// :deep(.program-set__song-rating .rating) {
//   display: flex;
//   align-items: center;
//   gap: 0.55rem;
//   margin-top: 0;
// }

// :deep(.program-set__song-rating .rating-hearts) {
//   display: inline-flex;
//   gap: 0.15rem;
// }

// :deep(.program-set__song-rating .icon-heart) {
//   --icon-size: 1.35rem;
// }

// :deep(.program-set__song-rating .icon-add),
// :deep(.program-set__song-rating .icon-change) {
//   width: 1.2rem;
//   height: 1.2rem;
//   margin: 0;
//   padding: 0;
//   border: 0;
// // }

// :deep(.program-set__song-rating .meta) {
//   margin-left: 0;
//   font-size: 1.2rem;
//   line-height: 1;
//   color: $tundora;
//   font-style: normal;
// }

// :deep(.program-set__song-rating .muted) {
//   font-size: 0.75rem;
//   color: rgba($tundora, 0.45);
//   font-style: italic;
// }

// :deep(.program-set__song-rating .fancy) {
//   position: static;
//   margin: 0;
//   font-size: 1.05rem;
//   transform: rotate(-12deg);
// }

@media (max-width: 900px) {
  .program-set__song-grid {
    grid-auto-flow: column;
    grid-auto-columns: minmax(9.5rem, 11rem);
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scroll-snap-type: x proximity;
    gap: 0.7rem;
  }}

//   :deep(.program-set__song-rating.rating-item) {
//     scroll-snap-align: start;
//   }

//   :deep(.program-set__song-rating .meta) {
//     font-size: 1.05rem;
//   }

//   :deep(.program-set__song-rating .muted) {
//     font-size: 0.7rem;
//   }
// }
</style>
