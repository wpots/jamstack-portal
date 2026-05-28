<template>
  <section :id="sectionId || undefined" class="program-set">
    <header v-if="title" class="program-set__header">
      <h3>{{ title }}</h3>
    </header>
    <ul class="program-set__songs">
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
import { defineComponent, PropType } from 'vue';
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
    songs: {
      type: Array as PropType<ProgramSongEntry[]>,
      default: () => [],
    },
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

.program-set__header {
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 0;
  }
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
