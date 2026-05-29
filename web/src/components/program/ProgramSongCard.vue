<template>
  <component :is="tag" class="program-song-card">
    <div class="program-song-card__art">
      <img
        v-if="albumArtUrl"
        :src="albumArtUrl"
        :alt="titleText"
        class="program-song-card__art-image"
      />
    </div>
    <div class="program-song-card__copy">
      <h3>{{ titleText }}</h3>
      <p v-if="artistText">{{ artistText }}</p>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import type { LinkedScore } from '@/composables/useContent/program.types';

type ProgramSongCardTag = 'article' | 'div';

interface ProgramSongCardItem {
  title: string;
  artist?: string;
  imageUrl?: string;
  linkedScore?: LinkedScore;
}

export default defineComponent({
  name: 'ProgramSongCard',
  props: {
    song: {
      type: Object as PropType<ProgramSongCardItem>,
      required: true,
    },
    tone: {
      type: String,
      default: 'tone-0',
    },
    tag: {
      type: String as PropType<ProgramSongCardTag>,
      default: 'article',
    },
  },
  setup(props) {
    const albumArtUrl = computed(
      () => props.song.imageUrl || props.song.linkedScore?.albumart?.url || '',
    );
    const titleText = computed(() => props.song.title || props.song.linkedScore?.title || '');
    const artistText = computed(() => props.song.artist || props.song.linkedScore?.artist || '');

    return { albumArtUrl, titleText, artistText };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-song-card {
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.program-song-card__art {
  display: flex;
  width: 100%;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  align-self: start;
  overflow: hidden;
}

.program-song-card__art-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.program-song-card__copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0.85rem 0.85rem 0.5rem;

  h3 {
    margin-bottom: 0.35rem;

    line-height: 1.15;
    font-family: var(--program-font-display, #{$font-fam-heading});
    font-size: 1.25rem;
  }

  p {
    font-size: 0.875rem;
  }
}
</style>
