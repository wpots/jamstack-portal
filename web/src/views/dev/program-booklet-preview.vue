<template>
  <main class="program-booklet-preview">
    <div class="setlist setlist--double-impact">
      <TimeTableBlock :cms="programPage" themeSlug="double-impact" />

      <div class="container">
        <FeedBackForm />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import FeedBackForm from '@/components/FeedBackForm.vue';
import TimeTableBlock from '@/components/Partials/TimeTableBlock.vue';
import { getProgramPreviewData } from '@/content/program-preview-data';
import type {
  ProgramItem,
  ProgramPage,
  ProgramRichTextItem,
  ProgramSetItem,
} from '@/composables/useContent/program.types';

interface ProgramSource {
  pageTitle?: string;
  eyebrow?: string;
  intro?: string;
  programItems?: ProgramItem[];
}

interface RawHeadingItem {
  type: 'heading';
  text: string;
}

interface RawSongItem {
  type: 'song';
  title: string;
  ensemble?: string;
}

interface RawTextItem {
  type: 'note' | 'pause';
  text: string;
}

type RawProgramItem = RawHeadingItem | RawSongItem | RawTextItem;

interface RawProgramSource {
  pageTitle?: string;
  eyebrow?: string;
  intro?: string;
  programItems?: RawProgramItem[];
}

const noteBodies: Record<string, string> = {
  'Praatje/overgang': 'Korte intro om het publiek mee te nemen in de opbouw van de avond.',
  Overgang: 'Licht, ritme en positionering wisselen. Goed moment voor een visuele overgang.',
  'Praatje / bedankje': 'Afsluitend woord met ruimte voor bedankjes en een zachte landing.',
  Pauze: 'Bar open, foyer aan en even ademhalen voor het tweede deel.',
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isProgramSource(value: unknown): value is ProgramSource {
  return isObject(value);
}

function isRawProgramSource(value: unknown): value is RawProgramSource {
  return isObject(value);
}

function isRawHeadingItem(value: unknown): value is RawHeadingItem {
  return isObject(value) && value.type === 'heading' && typeof value.text === 'string';
}

function isRawSongItem(value: unknown): value is RawSongItem {
  return isObject(value) && value.type === 'song' && typeof value.title === 'string';
}

function isRawTextItem(value: unknown): value is RawTextItem {
  return (
    isObject(value) &&
    (value.type === 'note' || value.type === 'pause') &&
    typeof value.text === 'string'
  );
}

function createRichTextBody(value: string): ProgramRichTextItem['body'] {
  return {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value,
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  };
}

function normalizeRawItems(items: RawProgramItem[]): ProgramItem[] {
  const normalized: ProgramItem[] = [];
  let currentSet: ProgramSetItem | null = null;

  const flushSet = () => {
    if (currentSet?.songs.length) {
      normalized.push(currentSet);
    }

    currentSet = null;
  };

  items.forEach((item) => {
    if (isRawHeadingItem(item)) {
      flushSet();
      currentSet = {
        type: 'set',
        title: item.text,
        songs: [],
      };
      return;
    }

    if (isRawSongItem(item)) {
      if (!currentSet) {
        currentSet = {
          type: 'set',
          title: item.ensemble || 'Set',
          songs: [],
        };
      }

      currentSet.songs.push({
        title: item.title,
      });
      return;
    }

    if (isRawTextItem(item)) {
      flushSet();
      normalized.push({
        type: 'richText',
        title: item.text,
        body: createRichTextBody(noteBodies[item.text] || item.text),
      });
    }
  });

  flushSet();

  return normalized;
}

function getProgramPage(source: unknown): ProgramPage {
  if (isProgramSource(source) && Array.isArray(source.programItems)) {
    return {
      pageTitle: source.pageTitle || 'Double Impact',
      eyebrow: source.eyebrow || 'United in Harmony',
      intro:
        source.intro ||
        'Swipe door de sets, ontdek de gezamenlijke nummers en geef live je favorieten door.',
      programItems: source.programItems,
    };
  }

  if (isRawProgramSource(source) && Array.isArray(source.programItems)) {
    const rawItems = source.programItems.filter(
      (item): item is RawProgramItem =>
        isRawHeadingItem(item) || isRawSongItem(item) || isRawTextItem(item),
    );

    return {
      pageTitle: source.pageTitle || 'Double Impact',
      eyebrow: source.eyebrow || 'United in Harmony',
      intro:
        source.intro ||
        'Swipe door de sets, ontdek de gezamenlijke nummers en geef live je favorieten door.',
      programItems: normalizeRawItems(rawItems),
    };
  }

  return {
    pageTitle: 'Double Impact',
    eyebrow: 'United in Harmony',
    intro: 'Swipe door de sets, ontdek de gezamenlijke nummers en geef live je favorieten door.',
    programItems: [],
  };
}

export default defineComponent({
  name: 'ProgramBookletPreviewPage',
  components: {
    FeedBackForm,
    TimeTableBlock,
  },
  setup() {
    const previewData = getProgramPreviewData('double-impact');

    const programPage = computed<ProgramPage>(() => getProgramPage(previewData));

    return {
      programPage,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');

.program-booklet-preview {
  min-height: 100vh;
  padding-bottom: 4rem;
  background: linear-gradient(180deg, $white 0%, $smoke 100%);
}

.program-booklet-preview__intro {
  padding-top: 2rem;
  padding-bottom: 1rem;
}

.program-booklet-preview__eyebrow {
  margin-bottom: 0.5rem;
  color: #ff4d9d;
  font-family: 'Bebas Neue', $font-fam-heading;
  font-size: 0.95rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.program-booklet-preview__intro h1 {
  margin-bottom: 0.75rem;
}

.program-booklet-preview__intro p:last-child {
  max-width: 42rem;
  margin-bottom: 0;
}

.setlist--double-impact {
  --program-font-display: 'Bebas Neue', $font-fam-heading;
  --program-font-title: 'DM Serif Display', Georgia, serif;
  --program-font-body: 'DM Sans', $font-fam-body;
  --program-color-accent: #ff4d9d;
  --program-color-contrast: #1c1320;
  --program-color-surface: #fff8fc;
}

.setlist--double-impact :deep(.container) {
  position: relative;
  z-index: 1;
}

.setlist--double-impact :deep(.feedback-form),
.setlist--double-impact :deep(form) {
  font-family: var(--program-font-body);
}
</style>
