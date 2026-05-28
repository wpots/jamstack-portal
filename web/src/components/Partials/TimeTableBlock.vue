<template>
  <section :class="['section timetableblock', themeClass]">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 timetableblock__content">
          <template v-for="(item, index) in cms.programItems" :key="index">
            <RichText v-if="item.type === 'richText'" :cms="item" class="intermezzo" />
            <TeaserBlock v-else-if="item.type === 'teaser'" :cms="item.cms" class="program-item" />
            <ProgramSetBlock
              v-else-if="item.type === 'set'"
              :sectionId="getSetSectionId(index)"
              :title="item.title"
              :songs="item.songs"
              :themeSlug="themeSlug"
              class="program-item"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import RichText from '../RichText.vue';
import TeaserBlock from './TeaserBlock.vue';
import ProgramSetBlock from '@/components/program/ProgramSetBlock.vue';
import type {
  ProgramItem,
  ProgramPage,
  ProgramSetItem,
} from '@/composables/useContent/program.types';

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

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: 'TimeTableBlock',
  components: {
    RichText,
    TeaserBlock,
    ProgramSetBlock,
  },
  props: {
    cms: {
      type: Object as PropType<ProgramPage>,
      default: () => {
        return { pageTitle: '', programItems: [] };
      },
    },
    themeSlug: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const isDoubleImpactTheme = computed(() => props.themeSlug === 'double-impact');
    const themeClass = computed(() =>
      isDoubleImpactTheme.value ? 'timetableblock--double-impact' : '',
    );

    const setSectionMap = computed(() => {
      const seenIds = new Map<string, number>();
      const sections = new Map<number, ProgramPageNavigationSection>();
      let setNumber = 0;

      props.cms.programItems.forEach((item, index) => {
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
        sections.set(index, { id, title });
      });

      return sections;
    });

    const setSections = computed<ProgramPageNavigationSection[]>(() =>
      Array.from(setSectionMap.value.values()),
    );

    const getSetSectionId = (index: number): string => {
      return setSectionMap.value.get(index)?.id || '';
    };

    return {
      getSetSectionId,
      isDoubleImpactTheme,
      setSections,
      themeClass,
    };
  },
});
</script>
<style lang="scss">
@use '@/assets/styles/common/variables' as *;
@use '@/assets/styles/common/mixins' as *;
.section {
  margin-top: -70px;
}
.program {
  position: relative;
}
.timetableblock__content {
  display: flex;
  flex-direction: column;
}
.intermezzo {
  display: flex;
  min-width: 100vw;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  text-align: center;
  background-color: $smoke;

  h4 {
    font-family: 'Satisfy', cursive;
    font-size: 2rem;
  }
  ul {
    margin-top: 1rem;
    text-align: left;
  }
}

.program-item {
  min-width: 100vw;
}
</style>
