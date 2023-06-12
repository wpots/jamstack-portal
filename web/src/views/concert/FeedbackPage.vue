<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Concert Feedback</h1>
        <h2>Stemmen op het Repertoire</h2>
        <RepertoirList :songs="songs" :showRatings="true" />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h2>Inzendingen op het gehele Concert</h2>
        <ul>
          <li v-for="(entry, idx) in feedback" :key="idx" class="cite">
            {{ entry.tiptop }} <span v-if="entry.naam">({{ entry.naam }})</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useContent } from '@/composables/useContent';
import { useFeedback } from '@/composables/useFeedback';
import RepertoirList from '@/components/RepertoirList.vue';

export default defineComponent({
  components: { RepertoirList },
  setup() {
    const { getSongs, fetchSongs } = useContent();
    const { getFeedback, fetchFeedback, fetchSongRatings, resolveSongRating } = useFeedback();
    const songs = computed(() => getSongs.value?.filter(song => resolveSongRating(song.sys.id)));
    const feedback = computed(() => getFeedback.value);
    onMounted(async () => {
      await fetchSongs();
      await fetchSongRatings();
      await fetchFeedback();
    });
    return { songs, feedback, getSongs };
  },
});
</script>
<style lang="scss">
cite {
  margin-bottom: 0.5rem;
  span {
    font-style: italic;
  }
}
</style>
