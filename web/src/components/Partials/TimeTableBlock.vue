<template>
  <section class="section timetableblock">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 timetableblock__content">
          <template v-for="(item, index) in cms.programItems" :key="index">
            <div
              v-if="isDoubleImpactTheme && item.type === 'richText'"
              class="program-item program-item--text"
            >
              <ProgramTextBlock v-bind="createTextBlock(item, index + 1)" />
            </div>
            <div
              v-else-if="isDoubleImpactTheme && item.type === 'teaser'"
              class="program-item program-item--text"
            >
              <div class="program-preview__teaser-stack">
                <ProgramTextBlock v-bind="createTeaserBlock(item, index + 1)">
                  <div v-if="hasFeaturedContent(item)" class="program-preview__featured-grid">
                    <ProgramPageFeaturedContent
                      v-for="(featuredItem, featuredIndex) in getFeaturedContentItems(item)"
                      :key="featuredItem.title || `${index}-${featuredIndex}`"
                      v-bind="featuredItem"
                    />
                  </div>
                </ProgramTextBlock>
              </div>
            </div>
            <RichText v-else-if="item.type === 'richText'" :cms="item" class="intermezzo" />
            <TeaserBlock v-else-if="item.type === 'teaser'" :cms="item.cms" class="program-item" />
            <ProgramSetBlock
              v-else-if="item.type === 'set'"
              :sectionId="getSetSectionId(index)"
              :kicker="item.eyebrow"
              :title="item.title"
              :songs="item.songs"
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
import ProgramPageFeaturedContent from '@/components/program/ProgramPageFeaturedContent.vue';
import ProgramSetBlock from '@/components/program/ProgramSetBlock.vue';
import ProgramTextBlock from '@/components/program/ProgramTextBlock.vue';
import { useProgramTheme } from '@/components/program/programTheme';
import type {
  ProgramItem,
  ProgramPage,
  ProgramRichTextItem,
  ProgramSetItem,
  ProgramTeaserItem,
} from '@/composables/useContent/program.types';

interface ProgramPageNavigationSection {
  id: string;
  title: string;
}

interface RichTextNode {
  nodeType?: string;
  value?: string;
  content?: RichTextNode[];
}

const blockNodeTypes = new Set([
  'paragraph',
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'heading-5',
  'heading-6',
  'blockquote',
  'hr',
  'unordered-list',
  'ordered-list',
  'list-item',
]);

interface TeaserColumnItem {
  __typename?: string;
  label?: string;
  title?: string;
  ctaText?: string;
  ctaUrl?: string;
  body?: {
    json?: RichTextNode;
  };
  lead?: {
    json?: RichTextNode;
  };
}

interface TeaserMedia {
  url?: string;
  title?: string;
}

interface TeaserCms {
  eyebrow?: string;
  title?: string;
  knockout?: boolean;
  backgroundImage?: TeaserMedia;
  columnContentCollection?: {
    items?: TeaserColumnItem[];
  };
}

interface ProgramTextBlockProps {
  variant: 'default' | 'spotlight' | 'knockout';
  kicker: string;
  title: string;
  description: string;
  descriptions?: string[];
  imageSrc?: string;
  mediaAlt?: string;
}

interface FeaturedContentCardProps {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

const noteDescriptions: Record<string, string> = {
  'Praatje/overgang': 'Korte intro om het publiek mee te nemen in de opbouw van de avond.',
  Overgang: 'Licht, ritme en positionering wisselen. Goed moment voor een visuele overgang.',
  'Praatje / bedankje': 'Afsluitend woord met ruimte voor bedankjes en een zachte landing.',
  Pauze: 'Bar open, foyer aan en even ademhalen voor het tweede deel.',
};

function isProgramSetItem(item: ProgramItem): item is ProgramSetItem {
  return item.type === 'set';
}

function isTeaserCms(value: unknown): value is TeaserCms {
  return Boolean(value) && typeof value === 'object';
}

function isRichTextNode(value: unknown): value is RichTextNode {
  return Boolean(value) && typeof value === 'object';
}

function getRichTextNode(value: unknown): RichTextNode | undefined {
  return isRichTextNode(value) ? value : undefined;
}

function extractRichText(node: RichTextNode | undefined): string {
  if (!node) {
    return '';
  }

  if (node.nodeType === 'text') {
    return node.value || '';
  }

  if (node.nodeType === 'hardBreak') {
    return '\n';
  }

  const content = (node.content || []).map((child) => extractRichText(child)).join('');

  if (blockNodeTypes.has(node.nodeType || '')) {
    return `${content}\n\n`;
  }

  return content;
}

function getTeaserColumns(value: TeaserCms | undefined): TeaserColumnItem[] {
  const items = value?.columnContentCollection?.items;

  return Array.isArray(items) ? items : [];
}

function getTeaserMedia(value: TeaserCms | undefined): TeaserMedia | undefined {
  const media = value?.backgroundImage;

  if (!media || typeof media !== 'object') {
    return undefined;
  }

  return media;
}

function extractTeaserDescriptions(value: TeaserCms | undefined): string[] {
  return getTeaserColumns(value)
    .filter((item) => item.__typename === 'ContentTypeRichText')
    .map((item) => extractRichText(getRichTextNode(item.body?.json)))
    .filter(Boolean);
}

function extractFeaturedContentItems(value: TeaserCms | undefined): FeaturedContentCardProps[] {
  return getTeaserColumns(value)
    .filter((item) => item.__typename === 'FeaturedContent')
    .filter((item) =>
      Boolean(
        (item.title && item.title.trim()) ||
        (item.ctaText && item.ctaText.trim() && item.ctaUrl && item.ctaUrl.trim()),
      ),
    )
    .map((item) => ({
      label: resolveEyebrow(item.label, 'Website'),
      title: item.title || '',
      description: extractRichText(getRichTextNode(item.lead?.json)),
      ctaText: item.ctaText || '',
      ctaUrl: item.ctaUrl || '',
    }))
    .filter((item) => Boolean(item.title || (item.ctaText && item.ctaUrl)));
}

function extractTeaserTitle(value: TeaserCms | undefined, occurrence: number): string {
  if (value?.title) {
    return value.title;
  }

  const firstColumnTitle = getTeaserColumns(value)
    .map((item) => item.title)
    .find((title): title is string => Boolean(title));

  return firstColumnTitle || `Teaser ${occurrence}`;
}

function resolveEyebrow(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function createTextBlock(item: ProgramRichTextItem, occurrence: number): ProgramTextBlockProps {
  const title = item.title || `Tussenstuk ${occurrence}`;
  const isPause = title.toLowerCase() === 'pauze';
  const description =
    extractRichText(getRichTextNode(item.body?.json)).trim() ||
    noteDescriptions[title] ||
    'Compact tekstblok voor een overgang, toelichting of ritmische onderbreking.';

  return {
    variant: item.knockout ? 'knockout' : isPause ? 'spotlight' : 'default',
    kicker: resolveEyebrow(item.eyebrow, isPause ? 'Pauze' : 'Tussenstuk'),
    title,
    description,
  };
}

function createTeaserBlock(item: ProgramTeaserItem, occurrence: number): ProgramTextBlockProps {
  const teaser = isTeaserCms(item.cms) ? item.cms : undefined;
  const title = extractTeaserTitle(teaser, occurrence);
  const descriptions = extractTeaserDescriptions(teaser);
  const backgroundImage = getTeaserMedia(teaser);

  return {
    variant: teaser?.knockout ? 'knockout' : 'spotlight',
    kicker: resolveEyebrow(teaser?.eyebrow, 'Verder kijken'),
    title: title || 'Meer van Goed Gebekt',
    description:
      descriptions[0] || 'Hier vind je meer over onze projecten, aankomende optredens en socials.',
    descriptions,
    imageSrc: backgroundImage?.url || '',
    mediaAlt: backgroundImage?.title || title,
  };
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
    ProgramPageFeaturedContent,
    ProgramTextBlock,
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
    const { themeSlug } = useProgramTheme();
    const resolvedThemeSlug = computed(() => props.themeSlug || themeSlug.value);
    const isDoubleImpactTheme = computed(() => resolvedThemeSlug.value === 'double-impact');

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

    const getFeaturedContentItems = (item: ProgramTeaserItem): FeaturedContentCardProps[] => {
      const teaser = isTeaserCms(item.cms) ? item.cms : undefined;

      return extractFeaturedContentItems(teaser);
    };

    const hasFeaturedContent = (item: ProgramTeaserItem): boolean => {
      return getFeaturedContentItems(item).length > 0;
    };

    return {
      createTeaserBlock,
      createTextBlock,
      getFeaturedContentItems,
      getSetSectionId,
      hasFeaturedContent,
      isDoubleImpactTheme,
      setSections,
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
  width: 100%;
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
  width: 100%;
  box-sizing: border-box;
}

.program-item--text {
  display: flex;
  justify-content: center;
}

.program-preview__teaser-stack {
  display: grid;
  gap: 1rem;
  width: min(100%, 62rem);
}

.program-preview__featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
  align-items: stretch;
}
</style>
