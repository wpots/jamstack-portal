<template>
  <div class="program-preview__song-grid">
    <article
      v-for="(song, index) in songs"
      :key="song.linkedScore?.sys?.id || `${song.title}-${index}`"
      class="program-preview__song-card"
      :class="`tone-${index % 4}`"
    >
      <div class="program-preview__song-art">
        <span>{{ getInitials(song.title) }}</span>
      </div>
      <div class="program-preview__song-copy">
        <p>{{ shortLabel }}</p>
        <h3>{{ song.title }}</h3>
        <small>{{ getSubtitle(song) }}</small>
      </div>
      <footer class="program-preview__song-actions">
        <AppRatingItem :song="song.linkedScore" variant="program-preview" />
      </footer>
    </article>
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

function getInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default defineComponent({
  name: 'ProgramSongGrid',
  components: {
    AppRatingItem,
  setup(props) {
  props: {

    const getSubtitle = (song: ProgramSongGridItem): string => {
      return song.linkedScore?.artist || props.shortLabel || 'Live in concert';
    };
    shortLabel: {
      type: String,
      default: '',
    },
    songs: {
      type: Array as PropType<ProgramSongGridItem[]>,
      default: () => [],
    return {
      getInitials,
      getSubtitle,
    };
  },
  setup() {
    const { fetchSongRatings, getSongRatings } = useFeedback();

    onMounted(async () => {
@use '@/assets/styles/common/variables' as *;

      if (!getSongRatings.value) {
        await fetchSongRatings();
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
    });

    return {};

.program-preview__song-card {
  overflow: hidden;
  background: $white;
  box-shadow: 0 16px 30px rgba($black, 0.08);
  border-radius: 1rem;
}

.program-preview__song-art {
  display: flex;
  aspect-ratio: 1.1;
  align-items: center;
  justify-content: center;
  color: $white;
  font-family: $font-fam-heading;
  font-size: 2.25rem;
}

.program-preview__song-copy {
  padding: 0.85rem 0.85rem 0.5rem;

  p {
    margin-bottom: 0.35rem;
    color: var(--program-color-accent);
    font-family: var(--program-font-display);
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
    line-height: 1.15;
  }

  small {
    display: block;
    line-height: 1.3;
  }
}

.program-preview__song-actions {
  padding: 0 0.85rem 0.85rem;
}

.tone-0 .program-preview__song-art {
  background: linear-gradient(135deg, $magenta, #ff5bb9);
}

.tone-1 .program-preview__song-art {
  background: linear-gradient(135deg, $green-alt, $theme-color-accent);
}

.tone-2 .program-preview__song-art {
  background: linear-gradient(135deg, $black, $tundora);
}

.tone-3 .program-preview__song-art {
  background: linear-gradient(135deg, $red, #ff8b4d);
}
  },
});
</script>
    grid-auto-flow: column;
    grid-auto-columns: minmax(9.5rem, 11rem);
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scroll-snap-type: x proximity;
  }

  .program-preview__song-card {
    scroll-snap-align: start;
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
