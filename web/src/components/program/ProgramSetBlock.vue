<template>
  <section :id="sectionId || undefined" class="program-set">
    <header v-if="kicker || title" class="program-section-header">
      <p v-if="kicker" class="kicker">{{ kicker }}</p>
      <h2 class="title">{{ title }}</h2>
    </header>

    <template v-if="singleSong">
      <AppRatingItem
        v-if="singleSong.linkedScore?.sys?.id"
        :interactive="false"
        :song="singleSong.linkedScore"
      />
      <article v-else class="program-set__custom-song">
        <img
          v-if="singleSong.imageUrl"
          :src="singleSong.imageUrl"
          :alt="singleSong.title"
          class="program-set__image"
        />
        <div class="program-set__meta">
          <h4>{{ singleSong.title }}</h4>
          <small v-if="singleSong.artist">{{ singleSong.artist }}</small>
        </div>
      </article>
    </template>

    <ul v-else class="program-set__songs">
      <li v-for="(song, index) in songs" :key="`${song.title}-${index}`" class="program-set__song">
        <AppRatingItem
          v-if="song.linkedScore?.sys?.id"
          :interactive="false"
          :song="song.linkedScore"
        />
        <article v-else class="program-set__custom-song">
          <img
            v-if="song.imageUrl"
            :src="song.imageUrl"
            :alt="song.title"
            class="program-set__image"
          />
          <div class="program-set__meta">
            <h4>{{ song.title }}</h4>
            <small v-if="song.artist">{{ song.artist }}</small>
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import AppRatingItem from '@/components/AppRatingItem.vue';
import type { ProgramSongEntry } from '@/composables/useContent/program.types';

export default defineComponent({
  name: 'ProgramSetBlock',
  components: { AppRatingItem },
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
  setup(props) {
    const singleSong = computed<ProgramSongEntry | undefined>(() =>
      props.songs.length === 1 ? props.songs[0] : undefined,
    );

    return { singleSong };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-set {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  padding: 1rem 2rem 2rem;
}

.program-set__songs {
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.program-set__song {
  flex: 0 0 auto;
}

.program-set__custom-song {
  display: flex;
  width: 228px;
  min-height: 132px;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  background: white;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
}

.program-set__image {
  width: 100%;
  height: 120px;
  margin-bottom: 0.75rem;
  object-fit: cover;
}

.program-set__meta {
  h4 {
    margin-bottom: 0.25rem;
  }

  small {
    color: $gray;
    font-family: 'Julius Sans One', serif;
    font-size: 0.75em;
  }
}
</style>
