<template>
  <AppRatingItem
    v-if="singleSong"
    :class="['program-set__song', { 'program-set__song--single': isVotingOpen === false }]"
    :interactive="isVotingOpen && repertoireReady"
    :performed-by-us="getSongIdentity(singleSong).performedByUs"
    :rating-id="getSongIdentity(singleSong).id"
    :rating-id-aliases="getSongIdentity(singleSong).aliases"
    :show-summary="showVotingSummary"
    :song="getRatingSong(singleSong)"
  >
    <ProgramSongCard :song="singleSong" tag="div" tone="tone-0" />
  </AppRatingItem>

  <div v-else class="program-set__song-grid">
    <AppRatingItem
      v-for="(song, index) in songs"
      :key="song.linkedScore?.sys?.id || `${song.title}-${index}`"
      class="program-set__song"
      :interactive="isVotingOpen && repertoireReady"
      :performed-by-us="getSongIdentity(song).performedByUs"
      :rating-id="getSongIdentity(song).id"
      :rating-id-aliases="getSongIdentity(song).aliases"
      :show-summary="showVotingSummary"
      :song="getRatingSong(song)"
    >
      <ProgramSongCard :song="song" tag="div" :tone="`tone-${index % 4}`" />
    </AppRatingItem>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import AppRatingItem from '@/components/AppRatingItem.vue';
import ProgramSongCard from '@/components/program/ProgramSongCard.vue';
import { useContent } from '@/composables/useContent';
import { useFeedback } from '@/composables/useFeedback';
import { resolveRatingSongIdentity } from '@/composables/useFeedback/resolveRatingSong.ts';
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
    const { fetchSongRatings } = useFeedback();
    const { getSongs, fetchSongs } = useContent();
    const { isVotingOpen, votingStatus } = useFeedbackAvailability();
    const repertoireReady = ref(false);
    const singleSong = computed<ProgramSongGridItem | undefined>(() =>
      props.songs.length === 1 ? props.songs[0] : undefined,
    );
    const showVotingSummary = computed(() => votingStatus.value !== 'disabled');

    const getSongIdentity = (song: ProgramSongGridItem) =>
      resolveRatingSongIdentity(
        {
          title: song.title,
          artist: song.artist,
          linkedScore: song.linkedScore,
        },
        getSongs.value || [],
      );

    const getRatingSong = (song: ProgramSongGridItem): LinkedScore => {
      const identity = getSongIdentity(song);
      const repertoireMatch = identity.repertoireMatch;

      return {
        albumart:
          song.linkedScore?.albumart ||
          repertoireMatch?.albumart ||
          (song.imageUrl ? { url: song.imageUrl } : undefined),
        artist: song.linkedScore?.artist || repertoireMatch?.artist || song.artist,
        sys: identity.id.startsWith('rating-') ? undefined : { id: identity.id },
        title: song.linkedScore?.title || repertoireMatch?.title || song.title,
      };
    };

    onMounted(async () => {
      await fetchSongs();
      repertoireReady.value = true;

      if (showVotingSummary.value) {
        await fetchSongRatings(getSongs.value || []);
      }
    });

    return {
      getRatingSong,
      getSongIdentity,
      isVotingOpen,
      repertoireReady,
      showVotingSummary,
      singleSong,
    };
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

.program-set__song--single {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 992px) {
  .program-set__song--single {
    max-width: var(--program-text-max, 44rem);
    margin-inline: auto;
  }
}

@media (max-width: 900px) {
  .program-set__song-grid {
    display: flex;
    width: auto;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    margin-right: -2rem;
    padding-right: 1rem;
    padding-bottom: 2.5rem;
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

  :deep(.program-set__song--single.rating-item) {
    /* Remove flex: 1 0 100% to prevent stretching/overlay */
    width: 100%;
    max-width: 100%;
  }
}
</style>
