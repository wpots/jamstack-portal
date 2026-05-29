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
        <h2>Open feedback</h2>
        <p class="feedback-note">
          Nieuwe feedbackinzendingen worden nog wel opgeslagen, maar niet meer publiek op deze
          pagina getoond.
        </p>
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
  name: 'FeedbackPage',
  setup() {
    const { getSongs, fetchSongs } = useContent();
    const { fetchSongRatings, resolveSongRating } = useFeedback();
    const songs = computed(() => getSongs.value?.filter((song) => resolveSongRating(song.sys.id)));

    onMounted(async () => {
      await fetchSongs();
      await fetchSongRatings();
    });

    return { songs };
  },
});
</script>
<style lang="scss">
.feedback-note {
  max-width: 42rem;
}
</style>
