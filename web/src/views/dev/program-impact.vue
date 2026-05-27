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
        <dl class="program-preview__meta">
          <div>
            <dt>onder leiding van</dt>
            <dd>Rolinde Zieverink</dd>
          </div>
          <div>
            <dt>Locatie</dt>
            <dd>{{ hero.venue }}</dd>
          </div>
          <div>
            <dt>Datum</dt>
            <dd>{{ hero.date }}</dd>
          </div>
        </dl>
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

        <aside class="program-preview__stats">
          <div class="program-preview__stat-card">
            <span>{{ totals.songCount }}</span>
            <small>nummers</small>
          </div>
          <div class="program-preview__stat-card">
            <span>{{ totals.setCount }}</span>
            <small>sets</small>
          </div>
          <div class="program-preview__stat-card">
            <span>{{ totals.ensembleCount }}</span>
            <small>ensembles</small>
          </div>
        </aside>
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
          <header class="program-preview__section-header">
            <div>
              <p class="program-preview__kicker">{{ block.ensembleLabel }}</p>
              <h2>{{ block.title }}</h2>
            </div>
            <div class="program-preview__section-note">
              <p>{{ block.description }}</p>
              <small>Mobiel eerst: compacte kaarten, tap om te stemmen, swipe voor de rest.</small>
            </div>
          </header>

          <div class="program-preview__song-grid">
            <article
              v-for="(song, index) in block.songs"
              :key="`${song.title}-${index}`"
              class="program-preview__song-card"
              :class="`tone-${index % 4}`"
            >
              <div class="program-preview__song-art">
                <span>{{ song.initials }}</span>
              </div>
              <div class="program-preview__song-copy">
                <p>{{ block.shortLabel }}</p>
                <h3>{{ song.title }}</h3>
                <small>{{ song.subtitle }}</small>
              </div>
              <footer class="program-preview__song-actions">
                <div class="program-preview__vote-pill" aria-hidden="true">
                  <span>♥</span>
                  <span>♥</span>
                  <span>♥</span>
                </div>
                <small>Tap om te stemmen</small>
              </footer>
            </article>
          </div>

          <div class="program-preview__feedback-bar">
            <p>Na deze set: snelle vote + open feedback blijft beschikbaar.</p>
            <button type="button">Geef je mening</button>
          </div>
        </template>

        <article v-else-if="block.type === 'note'" class="program-preview__note-block">
          <p class="program-preview__kicker">Tussenstuk</p>
          <h2>{{ block.title }}</h2>
          <p>{{ block.description }}</p>
        </article>

        <article v-else-if="block.type === 'pause'" class="program-preview__pause-block">
          <p>Pauze</p>
          <h2>{{ block.title }}</h2>
          <small>{{ block.description }}</small>
        </article>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { getProgramOverride } from '@/content/program-overrides';
import type {
  ProgramItem,
  ProgramRichTextItem,
  ProgramSetItem,
} from '@/composables/useContent/program.types';

interface RichTextNode {
  nodeType?: string;
  value?: string;
  content?: RichTextNode[];
}

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
  type: 'note' | 'pause';
  title: string;
  description: string;
}

type PreviewBlock = PreviewSetBlock | PreviewTextBlock;

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

  return (node.content || [])
    .map((child) => extractRichText(child))
    .join(' ')
    .trim();
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
  return Array.isArray(source?.programItems) ? source.programItems : [];
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
    extractRichText(getRichTextNode(item.body?.json)) ||
    noteDescriptions[title] ||
    'Compact tekstblok voor een overgang, toelichting of ritmische onderbreking.';

  return {
    id: `${slugify(title)}-${occurrence}`,
    type: title.toLowerCase() === 'pauze' ? 'pause' : 'note',
    title,
    description,
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
    }
  });

  return blocks;
}

export default defineComponent({
  name: 'ProgramImpactPreviewPage',
  setup() {
    const override = getProgramOverride('double-impact');
    const programSource = isProgramSource(override) ? override : null;

    const previewBlocks = computed(() => {
      return normalizeBlocks(getProgramItems(programSource));
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
      venue: 'Lokale previewroute',
      date: 'Najaar 2026',
    };

    return {
      hero,
      highlights,
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
.program-preview__section-header h2,
.program-preview__spotlight-copy h2,
.program-preview__editorial h2,
.program-preview__note-block h2,
.program-preview__pause-block h2 {
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

.program-preview__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 1rem;
  background: rgba($black, 0.28);
  backdrop-filter: blur(10px);

  dt {
    margin-bottom: 0.25rem;
    color: rgba($white, 0.65);
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    font-size: 1rem;
  }
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
.program-preview__spotlight-copy,
.program-preview__note-block {
  padding: 2rem;
  background: rgba($white, 0.88);
  box-shadow: 0 20px 40px rgba($black, 0.06);
}

.program-preview__stats {
  display: grid;
  gap: 1rem;
}

.program-preview__stat-card {
  display: flex;
  min-height: 7rem;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  background: $black;
  color: $white;

  span {
    color: var(--program-color-accent);
    font-family: var(--program-font-display);
    font-size: 2.3rem;
  }

  small {
    text-transform: uppercase;
  }
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

.program-preview__section-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 26rem);
  gap: 2rem;
  align-items: end;
  margin-bottom: 1.5rem;
}

.program-preview__section-note {
  margin-bottom: 0;
  color: rgba($tundora, 0.8);

  p,
  small {
    margin: 0;
  }

  small {
    display: block;
    margin-top: 0.4rem;
    color: rgba($tundora, 0.65);
  }
}

.program-preview__song-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

.program-preview__song-card {
  overflow: hidden;
  background: $white;
  box-shadow: 0 16px 30px rgba($black, 0.08);
  border-radius: 1rem;
}

.program-preview__song-art {
  display: flex;
  aspect-ratio: 1.1;
  align-items: center;
  justify-content: center;
  color: $white;
  font-family: $font-fam-heading;
  font-size: 2.25rem;
}

.program-preview__song-copy {
  padding: 0.85rem 0.85rem 0.5rem;

  p {
    margin-bottom: 0.35rem;
    color: var(--program-color-accent);
    font-family: var(--program-font-display);
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1rem;
    line-height: 1.15;
  }

  small {
    display: block;
    line-height: 1.3;
  }
}

.program-preview__song-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.85rem 0.85rem;

  small {
    color: rgba($tundora, 0.7);
    font-size: 0.7rem;
  }
}

.program-preview__vote-pill {
  display: inline-flex;
  gap: 0.15rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: rgba($magenta, 0.1);
  color: var(--program-color-accent);
  font-size: 0.75rem;
}

.program-preview__feedback-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: rgba($white, 0.82);
  box-shadow: 0 12px 24px rgba($black, 0.05);

  p {
    margin: 0;
    font-size: 0.9rem;
  }

  button {
    padding: 0.7rem 1rem;
    border: 0;
    border-radius: 999px;
    background: var(--program-color-accent);
    color: $white;
    font-family: var(--program-font-display);
    font-size: 0.75rem;
    white-space: nowrap;
  }
}

.tone-0 .program-preview__song-art {
  background: linear-gradient(135deg, $magenta, #ff5bb9);
}

.tone-1 .program-preview__song-art {
  background: linear-gradient(135deg, $green-alt, $theme-color-accent);
}

.tone-2 .program-preview__song-art {
  background: linear-gradient(135deg, $black, $tundora);
}

.tone-3 .program-preview__song-art {
  background: linear-gradient(135deg, $red, #ff8b4d);
}

.program-preview__note-block,
.program-preview__pause-block {
  max-width: 44rem;
}

.program-preview__pause-block {
  padding: 2.5rem;
  background: linear-gradient(135deg, $magenta, $black);
  color: $white;

  p {
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  h2 {
    margin-bottom: 0.5rem;
    font-size: clamp(2.4rem, 6vw, 4rem);
  }
}

@media (max-width: 900px) {
  .program-preview__intro,
  .program-preview__spotlight,
  .program-preview__section-header {
    grid-template-columns: 1fr;
  }

  .program-preview__highlight-grid {
    grid-template-columns: 1fr;
  }

  .program-preview__song-grid {
    grid-auto-flow: column;
    grid-auto-columns: minmax(9.5rem, 11rem);
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scroll-snap-type: x proximity;
  }

  .program-preview__song-card {
    scroll-snap-align: start;
  }

  .program-preview__feedback-bar {
    position: sticky;
    bottom: 1rem;
    z-index: 10;
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
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
