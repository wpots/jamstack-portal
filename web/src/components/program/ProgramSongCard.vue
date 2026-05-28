<template>
  <component :is="tag" class="program-song-card" :class="tone">
    <div class="program-song-card__art">
      <img
        v-if="albumArtUrl"
        :src="albumArtUrl"
        :alt="song.title"
        class="program-song-card__art-image"
      />
      <span v-else>{{ initials }}</span>
    </div>
    <div class="program-song-card__copy">
      <h3>{{ song.title }}</h3>
      <small v-if="song.artist">{{ song.artist }}</small>
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
    const initials = computed(() =>
      props.song.title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
    );

    return { albumArtUrl, initials };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-song-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.program-song-card__art {
  display: flex;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: $white;
  font-family: $font-fam-heading;
  font-size: 2.25rem;
}

.program-song-card__art-image {
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
    font-size: 1rem;
    line-height: 1.15;
  }

  small {
    display: block;
    line-height: 1.3;
  }
}

.tone-0 .program-song-card__art {
  background: linear-gradient(135deg, $magenta, #ff5bb9);
}

.tone-1 .program-song-card__art {
  background: linear-gradient(135deg, $green-alt, $theme-color-accent);
}

.tone-2 .program-song-card__art {
  background: linear-gradient(135deg, $black, $tundora);
}

.tone-3 .program-song-card__art {
  background: linear-gradient(135deg, $red, #ff8b4d);
}
</style>
