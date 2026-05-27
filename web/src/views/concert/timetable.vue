<template>
  <div :class="['setlist', `setlist--${slug}`]">
    <ProgramHero
      :title="getTimeTable.value.pageTitle"
      :eyebrow="getTimeTable.value.eyebrow"
      :lede="getTimeTable.value.intro"
      :themeSlug="slug"
    />
    <ProgramPageNavigation
      :sections="setSections"
      :includeOverview="isDoubleImpactTheme"
      :includeHighlights="isDoubleImpactTheme"
    />
    <ProgramStatsCloud :programItems="getTimeTable.value.programItems" />
    <TimeTableBlock :cms="getTimeTable" :themeSlug="slug" />
    <div class="container">
      <FeedBackForm></FeedBackForm>
    </div>
  </div>
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

export default defineComponent({
  components: {
    TimeTableBlock,
    FeedBackForm,
    ProgramHero,
    ProgramPageNavigation,
    ProgramStatsCloud,
  },
  name: 'TimeTablePage',
  setup() {
    const route = useRoute();
    const { getTimeTable } = useContent('timetable', { route });
    const { fetchSongRatings, getSongRatings } = useFeedback();
    const slug = computed(() => `${route.params.id || ''}`);
    onMounted(async () => {
      if (!getSongRatings.value) await fetchSongRatings();
    });

    return { slug, getTimeTable, getSongRatings };
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
