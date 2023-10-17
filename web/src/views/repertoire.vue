<template>
  <RepertoirList :songs="songs" :showRatings="true" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useContent } from '../composables/useContent';

import RepertoirList from '@/components/RepertoirList.vue';

export default defineComponent({
  name: 'RepertoirPage',
  components: { RepertoirList },
  setup() {
    const { getSongs, fetchSongs } = useContent();
    const songs = computed(() => getSongs.value);
    onMounted(async () => {
      await fetchSongs();
    });
    return { songs };
  },
});
</script>
