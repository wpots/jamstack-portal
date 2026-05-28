<template>
  <div class="song-meta" :class="tone">
    <img v-if="imageUrl" :src="imageUrl" :alt="titleText" />
    <div v-else class="song-art-fallback" aria-hidden="true">
      <span>{{ initials }}</span>
    </div>
    <div class="song-title">
      <component :is="headingTag" :id="headingId">{{ titleText }}</component>
      <small v-if="artist">{{ artist }}</small>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

type SongCardHeadingTag = 'h3' | 'h4';

export default defineComponent({
  name: 'AppSongCard',
  props: {
    artist: {
      type: String,
      default: '',
    },
    headingId: {
      type: String,
      default: undefined,
    },
    headingTag: {
      type: String as PropType<SongCardHeadingTag>,
      default: 'h4',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    tone: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const titleText = computed(() => props.title || 'Onbekend nummer');
    const initials = computed(() =>
      titleText.value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
    );

    return {
      initials,
      titleText,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.song-meta {
  display: flex;
  gap: 1rem;

  small {
    font-family: 'Julius Sans One', serif;
    color: $gray;
    font-size: 0.7em;
  }

  img,
  .song-art-fallback {
    flex: 0 0 20%;
    max-width: 20%;
    border: 2px solid $smoke;
    border-radius: 4px;
  }

  img {
    aspect-ratio: 1;
    object-fit: cover;
  }
}

.song-title {
  min-width: 0;
}

.song-art-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba($magenta, 0.95), rgba($black, 0.9));
  color: $white;
  font-size: 1rem;
  font-weight: 700;
}
</style>
