<template>
  <ProgramThemeProvider :class="['setlist', `setlist--${slug}`]" :themeSlug="slug">
    <ProgramHero
      :title="getTimeTable.pageTitle"
      :eyebrow="getTimeTable.eyebrow"
      :lede="getTimeTable.intro"
    />
    <ProgramStatsCloud :programItems="getTimeTable.programItems" />
    <ProgramPageNavigation
      :sections="setSections"
      :includeOverview="isDoubleImpactTheme"
      :includeHighlights="isDoubleImpactTheme"
    />
    <TimeTableBlock :cms="getTimeTable" />
    <div class="container">
      <FeedBackForm></FeedBackForm>
    </div>
  </ProgramThemeProvider>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TimeTableBlock from '../../components/Partials/TimeTableBlock.vue';
import { useContent } from '../../composables/useContent';
import { useFeedback } from '../../composables/useFeedback';
import FeedBackForm from '../../components/FeedBackForm.vue';
import ProgramHero from '@/components/program/ProgramHero.vue';
import ProgramPageNavigation from '@/components/program/ProgramPageNavigation.vue';
import ProgramStatsCloud from '@/components/program/ProgramStatsCloud.vue';
import ProgramThemeProvider from '@/components/program/ProgramThemeProvider.vue';
import type { ProgramItem, ProgramSetItem } from '@/composables/useContent/program.types';

interface ProgramPageNavigationSection {
  id: string;
  title: string;
}

function isProgramSetItem(item: ProgramItem): item is ProgramSetItem {
  return item.type === 'set';
}

function createSectionSlug(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');

  return slug || fallback;
}

export default defineComponent({
  components: {
    TimeTableBlock,
    FeedBackForm,
    ProgramHero,
    ProgramPageNavigation,
    ProgramStatsCloud,
    ProgramThemeProvider,
  },
  name: 'TimeTablePage',
  setup() {
    const route = useRoute();
    const { getTimeTable } = useContent('timetable', { route });
    const { fetchSongRatings, getSongRatings } = useFeedback();
    const slug = computed(() => `${route.params.id || route.meta.previewConcertId || ''}`);
    const isDoubleImpactTheme = computed(() => slug.value === 'double-impact');

    const setSections = computed<ProgramPageNavigationSection[]>(() => {
      const seenIds = new Map<string, number>();
      const sections: ProgramPageNavigationSection[] = [];
      let setNumber = 0;

      getTimeTable.value.programItems.forEach((item) => {
        if (!isProgramSetItem(item)) {
          return;
        }

        setNumber += 1;
        const title = item.title || `Set ${setNumber}`;
        const fallbackId = `set-${setNumber}`;
        const baseId = createSectionSlug(title, fallbackId);
        const occurrence = (seenIds.get(baseId) || 0) + 1;
        const id = occurrence > 1 ? `${baseId}-${occurrence}` : baseId;

        seenIds.set(baseId, occurrence);

        sections.push({ id, title });
      });

      return sections;
    });

    onMounted(async () => {
      if (!getSongRatings.value) await fetchSongRatings();
    });

    return {
      getSongRatings,
      getTimeTable,
      isDoubleImpactTheme,
      setSections,
      slug,
    };
  },
});
</script>
<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;
@use '@/assets/styles/common/mixins' as *;

.timeline {
  margin: 2rem;
  display: flex;
}
.sound-wave {
  display: flex;
  align-items: center;

  &.large {
    --wave-height: 36px;
    --wave-decline-height: 133px;
  }

  &.small {
    --wave-height: 5px;
    --wave-incline: 2px;
    --wave-decline: 5px;
    --wave-decline-height: 30px;
  }
}
.line {
  &::before,
  &::after {
    content: '';
    display: block;
    width: 4px;
    height: var(--wave-height, 3px);
    background-color: black;
    margin-left: 1px;
    border-radius: 0 0 2px 2px;
    opacity: 0.6;
  }
  &::before {
    transform: scaleY(-1);
    opacity: 0.3;
    margin-bottom: 1px;
  }
}
.wave {
  @extend .line;

  @for $i from 1 through 6 {
    &:nth-child(#{$i}) {
      &::before,
      &::after {
        height: calc(0px + #{$i} * var(--wave-incline, 7px));
      }
    }
  }

  @for $i from 8 through 13 {
    &:nth-child(#{$i}) {
      &::before,
      &::after {
        height: calc(var(--wave-decline-height, 85px) - #{$i} * var(--wave-decline, 11px));
      }
    }
  }
}
</style>
