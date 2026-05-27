<template>
  <TimeTableBlock :cms="programPage" themeSlug="double-impact" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import TimeTableBlock from '@/components/Partials/TimeTableBlock.vue';
import { toDomain } from '@/composables/useContent/content.mapper';
import type { ProgramPage } from '@/composables/useContent/program.types';
import doubleImpactLegacyPreview from '@/content/program-preview-data/double-impact-legacy.json';

export default defineComponent({
  name: 'LegacyTimeTablePreviewPage',
  components: { TimeTableBlock },
  setup() {
    const programPage = computed<ProgramPage>(() => {
      return toDomain.mapTimeTable(doubleImpactLegacyPreview);
    });

    return {
      programPage,
    };
  },
});
</script>