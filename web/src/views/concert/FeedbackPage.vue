<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Concert Feedback</h1>
      </div>
      <div class="col-12">
        <h2>Stemmen op het Repertoire</h2>
      </div>
      <div class="col-12">
        <RepertoirList :songs="songs" :showRatings="true" />
      </div>
    </div>
  </div>

  <h2>Inzendingen op het gehele Concert</h2>
  <ul>
    <li v-for="(entry, idx) in feedback" :key="idx">{{ entry.tiptop }}</li>
  </ul>
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
    const { getFeedback, fetchFeedback } = useFeedback();
    const songs = computed(() => getSongs.value);
    const feedback = computed(() => getFeedback.value);
    onMounted(async () => {
      await fetchSongs();
      await fetchFeedback();
    });
    return { songs, feedback };
  },
});
</script>
