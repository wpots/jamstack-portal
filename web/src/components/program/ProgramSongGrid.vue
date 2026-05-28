<template>
  <div class="program-preview__song-grid">
    <article
      v-for="(song, index) in songs"
      :key="`${song.title}-${index}`"
      class="program-preview__song-card"
      :class="`tone-${index % 4}`"
    >
      <div class="program-preview__song-art">
        <span>{{ song.initials }}</span>
      </div>
      <div class="program-preview__song-copy">
        <p>{{ shortLabel }}</p>
        <h3>{{ song.title }}</h3>
        <small>{{ song.subtitle }}</small>
      </div>
      <footer class="program-preview__song-actions">
        <div class="program-preview__vote-pill" aria-hidden="true">
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
        </div>
        <small>Tap om te stemmen</small>
      </footer>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface ProgramSongGridItem {
  title: string;
  initials: string;
  subtitle: string;
}

export default defineComponent({
  name: 'ProgramSongGrid',
  props: {
    shortLabel: {
      type: String,
      default: '',
    },
    songs: {
      type: Array as PropType<ProgramSongGridItem[]>,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-preview__song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.85rem 0.85rem;

  small {
    color: rgba($tundora, 0.7);
    font-size: 0.7rem;
  }
}

.program-preview__vote-pill {
  display: inline-flex;
  gap: 0.15rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: rgba($magenta, 0.1);
  color: var(--program-color-accent);
  font-size: 0.75rem;
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

@media (max-width: 900px) {
  .program-preview__song-grid {
    grid-auto-flow: column;
    grid-auto-columns: minmax(9.5rem, 11rem);
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scroll-snap-type: x proximity;
  }

  .program-preview__song-card {
    scroll-snap-align: start;
  }
}
</style>
