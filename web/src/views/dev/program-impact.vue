<template>
  <div class="program-preview">
    <header class="program-preview__hero">
      <img
        class="program-preview__confetti"
        src="/img/concerts/2026DuoConcert%20confetti.svg"
        alt=""
        aria-hidden="true"
      />
      <div class="program-preview__hero-content container-fluid">
        <p class="program-preview__eyebrow">Firma Vocaal & Goed Gebekt</p>
        <h1>{{ hero.title }}</h1>
        <p class="program-preview__lede">
          {{ hero.description }}
        </p>
        <ProgramMeta :items="heroMeta" />
      </div>
      <img
        class="program-preview__waves program-preview__waves--back"
        src="/img/concerts/2026DuoConcert%20waves.svg"
        alt=""
        aria-hidden="true"
      />
      <img
        class="program-preview__waves program-preview__waves--front"
        src="/img/concerts/2026DuoConcert%20waves2.svg"
        alt=""
        aria-hidden="true"
      />
    </header>

    <nav class="program-preview__nav">
      <div class="container-fluid program-preview__nav-inner">
        <a href="#overview">Overzicht</a>
        <a href="#spotlight">Highlights</a>
        <a v-for="section in setSections" :key="section.id" :href="`#${section.id}`">
          {{ section.title }}
        </a>
      </div>
    </nav>

    <main>
      <section id="overview" class="program-preview__intro container-fluid">
        <article class="program-preview__editorial">
          <p class="program-preview__kicker">Voorbeeldopzet</p>
          <h2>Meer magazine, minder timetable</h2>
          <p>
            Dit is een lokale previewroute met dummy data op basis van
            <strong>double-impact</strong>. De opbouw is vertical-first: een hero, editorial
            tekstblokken, set-secties als cards en duidelijke chapter breaks.
          </p>
        </article>

        <ProgramStatsCloud :programItems="programItems" />
      </section>

      <section id="spotlight" class="program-preview__spotlight container-fluid">
        <div class="program-preview__spotlight-copy">
          <p class="program-preview__kicker">Highlights</p>
          <h2>Een mix van samenzang, koorsets en rustpunten</h2>
          <p>
            Het ontwerp houdt de energie van het bestaande merk vast, maar leest als een modern
            programma-boekje. Elke set heeft zijn eigen hoofdstuk, terwijl praatjes en pauze als
            visuele rustpunten werken.
          </p>
        </div>

        <div class="program-preview__highlight-grid">
          <article
            v-for="highlight in highlights"
            :key="highlight.title"
            class="program-preview__highlight-card"
          >
            <p>{{ highlight.label }}</p>
            <h3>{{ highlight.title }}</h3>
            <small>{{ highlight.meta }}</small>
          </article>
        </div>
      </section>

      <section
        v-for="block in previewBlocks"
        :id="block.id"
        :key="block.id"
        class="program-preview__section container-fluid"
      >
        <template v-if="block.type === 'set'">
          <ProgramSetBlockHeader
            :kicker="block.ensembleLabel"
            :title="block.title"
            :description="block.description"
            note="Mobiel eerst: compacte kaarten, tap om te stemmen, swipe voor de rest."
          />

          <ProgramSongGrid :short-label="block.shortLabel" :songs="block.songs" />

          <ProgramFeedbackCTA />
        </template>

        <ProgramTextBlock
          v-else-if="block.type === 'note'"
          kicker="Tussenstuk"
          :title="block.title"
          :description="block.description"
        />

        <ProgramTextBlock
          v-else-if="block.type === 'pause'"
          variant="knockout"
          kicker="Pauze"
          :title="block.title"
          :description="block.description"
        />

        <div v-else class="program-preview__teaser-stack">
          <ProgramTextBlock
            variant="knockout"
            kicker="Verder kijken"
            :title="block.title"
            :description="block.description"
          >
            <div class="program-preview__featured-grid">
              <ProgramPageFeaturedContent
                v-for="(featuredItem, featuredIndex) in block.featuredContent"
                :key="featuredItem.title || `${block.id}-${featuredIndex}`"
                v-bind="featuredItem"
              />
            </div>
          </ProgramTextBlock>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ProgramFeedbackCTA from '@/components/program/ProgramFeedbackCTA.vue';
import ProgramMeta, { ProgramMetaItem } from '@/components/program/ProgramMeta.vue';
import ProgramPageFeaturedContent from '@/components/program/ProgramPageFeaturedContent.vue';
import ProgramSetBlockHeader from '@/components/program/ProgramSetBlockHeader.vue';
import ProgramSongGrid from '@/components/program/ProgramSongGrid.vue';
import ProgramStatsCloud from '@/components/program/ProgramStatsCloud.vue';
import ProgramTextBlock from '@/components/program/ProgramTextBlock.vue';
import { getProgramPreviewPage } from '@/content/program-preview-data';
import type {
  ProgramItem,
  ProgramRichTextItem,
  ProgramSetItem,
  ProgramTeaserItem,
} from '@/composables/useContent/program.types';

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

interface ProgramSource {
  programItems?: ProgramItem[];
}

interface PreviewSong {
  title: string;
  initials: string;
  subtitle: string;
}

interface PreviewSetBlock {
  id: string;
  type: 'set';
  title: string;
  shortLabel: string;
  ensembleLabel: string;
  description: string;
  songs: PreviewSong[];
}

interface PreviewTextBlock {
  id: string;
  type: 'note' | 'pause' | 'teaser';
  title: string;
  description: string;
  featuredContent?: PreviewFeaturedContent[];
}

type PreviewBlock = PreviewSetBlock | PreviewTextBlock;

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

interface PreviewFeaturedContent {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

interface TeaserCms {
  eyebrow?: string;
  title?: string;
  columnContentCollection?: {
    items?: TeaserColumnItem[];
  };
}

const noteDescriptions: Record<string, string> = {
  'Praatje/overgang': 'Korte intro om het publiek mee te nemen in de opbouw van de avond.',
  Overgang: 'Licht, ritme en positionering wisselen. Goed moment voor een visuele overgang.',
  'Praatje / bedankje': 'Afsluitend woord met ruimte voor bedankjes en een zachte landing.',
  Pauze: 'Bar open, foyer aan en even ademhalen voor het tweede deel.',
};

const sectionDescriptions: Record<string, string> = {
  Gezamenlijk: 'Groot, open en meteen verbindend. Ideaal als hoofdstuk-break met veel lucht.',
  'Firma Vocaal': 'Meer groove en pop-energie. Cards kunnen hier wat donkerder en ritmischer.',
  'Goed Gebekt': 'Direct en punchy. Hier werkt de huidige kaart-esthetiek heel goed door.',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
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

function isRichTextNode(value: unknown): value is RichTextNode {
  return Boolean(value) && typeof value === 'object';
}

function getRichTextNode(value: unknown): RichTextNode | undefined {
  return isRichTextNode(value) ? value : undefined;
}

function isProgramSource(value: unknown): value is ProgramSource {
  return Boolean(value) && typeof value === 'object';
}

function getProgramItems(source: ProgramSource | null): ProgramItem[] {
  return source && Array.isArray(source.programItems) ? source.programItems : [];
}

function isTeaserCms(value: unknown): value is TeaserCms {
  return Boolean(value) && typeof value === 'object';
}

function getTeaserColumns(value: TeaserCms | undefined): TeaserColumnItem[] {
  const items = value?.columnContentCollection?.items;

  return Array.isArray(items) ? items : [];
}

function extractFeaturedContentItems(value: TeaserCms | undefined): PreviewFeaturedContent[] {
  return getTeaserColumns(value)
    .filter((item) => item.__typename === 'FeaturedContent')
    .filter((item) => Boolean((item.title && item.title.trim()) || (item.ctaText && item.ctaText.trim() && item.ctaUrl && item.ctaUrl.trim())))
    .map((item) => ({
      label: item.label || 'Website',
      title: item.title || '',
      description: extractRichText(getRichTextNode(item.lead?.json)),
      ctaText: item.ctaText || '',
      ctaUrl: item.ctaUrl || '',
    }))
    .filter((item) => Boolean(item.title || (item.ctaText && item.ctaUrl)));
}

function createSetBlock(item: ProgramSetItem, occurrence: number): PreviewSetBlock {
  const title = item.title || `Set ${occurrence}`;

  return {
    id: `${slugify(title)}-${occurrence}`,
    type: 'set',
    title,
    shortLabel: title === 'Gezamenlijk' ? 'Samen' : title,
    ensembleLabel: title,
    description:
      sectionDescriptions[title] ||
      'Nieuwe sectie in het programma-boekje met ruimte voor beeld en typografie.',
    songs: item.songs.map((song) => ({
      title: song.title,
      initials: initials(song.title),
      subtitle: song.artist || `${title} live in concert`,
    })),
  };
}

function createTextBlock(item: ProgramRichTextItem, occurrence: number): PreviewTextBlock {
  const title = item.title || `Tussenstuk ${occurrence}`;
  const description =
    extractRichText(getRichTextNode(item.body?.json)).trim() ||
    noteDescriptions[title] ||
    'Compact tekstblok voor een overgang, toelichting of ritmische onderbreking.';

  return {
    id: `${slugify(title)}-${occurrence}`,
    type: title.toLowerCase() === 'pauze' ? 'pause' : 'note',
    title,
    description,
  };
}

function createTeaserBlock(item: ProgramTeaserItem, occurrence: number): PreviewTextBlock {
  const teaser = isTeaserCms(item.cms) ? item.cms : undefined;
  const title = typeof teaser?.title === 'string' ? teaser.title : `Teaser ${occurrence}`;
  const featuredContent = extractFeaturedContentItems(teaser);

  return {
    id: `${slugify(title)}-${occurrence}`,
    type: 'teaser',
    title: title || 'Meer van Goed Gebekt',
    description: 'Hier vind je meer over ons, projecten, aankomende optredens en socials.',
    featuredContent,
  };
}

function normalizeBlocks(items: ProgramItem[]): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  let occurrence = 0;

  items.forEach((item) => {
    occurrence += 1;

    if (item.type === 'set') {
      blocks.push(createSetBlock(item, occurrence));
      return;
    }

    if (item.type === 'richText') {
      blocks.push(createTextBlock(item, occurrence));
      return;
    }

    if (item.type === 'teaser') {
      const block = createTeaserBlock(item, occurrence);

      if (block.featuredContent?.length) {
        blocks.push(block);
      }
    }
  });

  return blocks;
}

export default defineComponent({
  name: 'ProgramImpactPreviewPage',
  components: {
    ProgramFeedbackCTA,
    ProgramMeta,
    ProgramPageFeaturedContent,
    ProgramSetBlockHeader,
    ProgramSongGrid,
    ProgramStatsCloud,
    ProgramTextBlock,
  },
  setup() {
    const previewPage = getProgramPreviewPage('double-impact');
    const programSource = isProgramSource(previewPage) ? previewPage : null;
    const programItems = getProgramItems(programSource);

    const previewBlocks = computed(() => {
      return normalizeBlocks(programItems);
    });

    const setSections = computed(() => {
      return previewBlocks.value.filter((block): block is PreviewSetBlock => block.type === 'set');
    });

    const totals = computed(() => {
      const songCount = setSections.value.reduce((total, block) => total + block.songs.length, 0);
      const ensembleCount = new Set(setSections.value.map((block) => block.title)).size;

      return {
        songCount,
        setCount: setSections.value.length,
        ensembleCount,
      };
    });

    const highlights = computed(() => {
      const picks = setSections.value.flatMap((block) =>
        block.songs.slice(0, 1).map((song) => ({
          label: block.shortLabel,
          title: song.title,
          meta: block.description,
        })),
      );

      return picks.slice(0, 3);
    });

    const hero = {
      title: 'Double Impact',
      description:
        'Voorzet voor een nieuw programma-boekje: meer hoofdstukken, meer beeld, meer rust en een duidelijkere flow dan de oude timetable.',
      concert: 'Goed Gebekt × Firma Vocaal',
      conductor: 'Rolinde Zieverink',
      venue: 'Lokale previewroute',
      date: 'Najaar 2026',
    };

    const heroMeta: ProgramMetaItem[] = [
      {
        term: 'onder leiding van',
        description: hero.conductor,
      },
      {
        term: 'Locatie',
        description: hero.venue,
      },
      {
        term: 'Datum',
        description: hero.date,
      },
    ];

    return {
      hero,
      heroMeta,
      highlights,
      programItems,
      previewBlocks,
      setSections,
      totals,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');

.program-preview {
  --program-font-display: 'Bebas Neue', #{$font-fam-heading};
  --program-font-title: 'DM Serif Display', Georgia, serif;
  --program-font-body: 'DM Sans', #{$font-fam-body};
  --program-color-accent: #ff4d9d;
  min-height: 100vh;
  padding-bottom: 4rem;
  background:
    radial-gradient(circle at top left, rgba($magenta, 0.14), transparent 35%),
    linear-gradient(180deg, $white 0%, $smoke 100%);
  color: $tundora;
  font-family: var(--program-font-body);
}

.program-preview__hero {
  position: relative;
  padding: 8rem 0 4rem;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 77, 157, 0.22), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(59, 236, 168, 0.18), transparent 22%),
    linear-gradient(160deg, #140812 0%, #2a1322 54%, #120e1d 100%);
  color: $white;
  overflow: hidden;
}

.program-preview__hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 7rem;
  background: linear-gradient(180deg, transparent, rgba($black, 0.65));
  pointer-events: none;
}

.program-preview__hero-content {
  position: relative;
  z-index: 1;
  max-width: 70rem;
}

.program-preview__confetti,
.program-preview__waves {
  position: absolute;
  pointer-events: none;
}

.program-preview__confetti {
  top: 1rem;
  right: 1rem;
  z-index: 1;
  width: min(15rem, 34vw);
  opacity: 0.9;
}

.program-preview__waves {
  left: 50%;
  bottom: -1px;
  width: min(120rem, 150vw);
  max-width: none;
  transform: translateX(-50%);
  transform-origin: center bottom;
}

.program-preview__waves--back {
  z-index: 0;
  opacity: 0.85;
}

.program-preview__waves--front {
  z-index: 1;
  width: min(118rem, 146vw);
  opacity: 0.95;
}

.program-preview__eyebrow,
.program-preview__kicker {
  margin-bottom: 0.75rem;
  color: var(--program-color-accent);
  font-family: var(--program-font-display);
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.program-preview__hero h1,
.program-preview__spotlight-copy h2,
.program-preview__editorial h2 {
  font-family: var(--program-font-display);
}

.program-preview__hero h1 {
  max-width: 10ch;
  margin-bottom: 1rem;
  font-family: var(--program-font-title);
  font-weight: 400;
  text-shadow: 0 12px 30px rgba($black, 0.4);
  font-size: clamp(3.1rem, 8vw, 6.3rem);
  line-height: 0.88;
  letter-spacing: -0.03em;
}

.program-preview__lede {
  max-width: 42rem;
  margin-bottom: 2rem;
  font-size: 1.15rem;
  text-shadow: 0 6px 18px rgba($black, 0.35);
}

.program-preview__nav {
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(12px);
  background: rgba($white, 0.92);
  border-bottom: 1px solid rgba($black, 0.08);
}

.program-preview__nav-inner {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;

  a {
    color: $tundora;
    font-family: var(--program-font-display);
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: $magenta;
    }
  }
}

.program-preview__intro,
.program-preview__spotlight,
.program-preview__section {
  padding-top: 3rem;
}

.program-preview__intro {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
  gap: 2rem;
}

.program-preview__editorial,
.program-preview__spotlight-copy {
  padding: 2rem;
  background: rgba($white, 0.88);
  box-shadow: 0 20px 40px rgba($black, 0.06);
}

.program-preview :deep(.program-stats-cloud) {
  margin-top: 0;
  padding: 0;
}

.program-preview :deep(.program-stats-cloud__list) {
  justify-content: flex-start;
}

.program-preview__spotlight {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 2rem;
}

.program-preview__highlight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
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
  width: min(100%, 62rem);
}

.program-preview__highlight-card {
  padding: 1.25rem;
  background: linear-gradient(160deg, rgba($magenta, 0.12), rgba($white, 0.96));
  border-top: 4px solid $magenta;

  p {
    margin-bottom: 0.4rem;
    color: var(--program-color-accent);
    font-family: var(--program-font-display);
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  h3 {
    margin-bottom: 0.6rem;
  }
}

@media (max-width: 900px) {
  .program-preview__intro,
  .program-preview__spotlight {
    grid-template-columns: 1fr;
  }

  .program-preview__highlight-grid {
    grid-template-columns: 1fr;
  }

  .program-preview__confetti {
    top: 0.75rem;
    right: 0.5rem;
    width: 8.5rem;
  }

  .program-preview__waves--back {
    width: 165vw;
  }

  .program-preview__waves--front {
    width: 160vw;
  }
}
</style>
