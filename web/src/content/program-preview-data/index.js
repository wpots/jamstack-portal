import doubleImpact from './double-impact.json';

const programPreviewData = {
  [doubleImpact.concertId]: doubleImpact,
};

const noteBodies = {
  'Praatje/overgang': 'Korte intro om het publiek mee te nemen in de opbouw van de avond.',
  Overgang: 'Licht, ritme en positionering wisselen. Goed moment voor een visuele overgang.',
  'Praatje / bedankje': 'Afsluitend woord met ruimte voor bedankjes en een zachte landing.',
  Pauze: 'Bar open, foyer aan en even ademhalen voor het tweede deel.',
};

function isObject(value) {
  return Boolean(value) && typeof value === 'object';
}

function isRawHeadingItem(value) {
  return isObject(value) && value.type === 'heading' && typeof value.text === 'string';
}

function isRawSongItem(value) {
  return isObject(value) && value.type === 'song' && typeof value.title === 'string';
}

function isRawTextItem(value) {
  return (
    isObject(value) &&
    (value.type === 'note' || value.type === 'pause') &&
    typeof value.text === 'string'
  );
}

function isNormalizedProgramItem(value) {
  return (
    isObject(value) &&
    (value.type === 'set' || value.type === 'richText' || value.type === 'teaser')
  );
}

function createRichTextBody(value) {
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

function normalizeRawItems(items) {
  const normalized = [];
  let currentSet = null;

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

export function getProgramPreviewData(concertId) {
  if (!concertId) {
    return null;
  }

  return programPreviewData[concertId] || null;
}

export function getProgramPreviewPage(concertId) {
  const source = getProgramPreviewData(concertId);

  if (!source || !Array.isArray(source.programItems)) {
    return null;
  }

  const normalizedItems = source.programItems.filter((item) => {
    return isNormalizedProgramItem(item);
  });

  if (normalizedItems.length) {
    return {
      pageTitle: source.pageTitle || 'Double Impact',
      eyebrow: source.eyebrow || 'United in Harmony',
      intro:
        source.intro ||
        'Swipe door de sets, ontdek de gezamenlijke nummers en geef live je favorieten door.',
      programItems: normalizedItems,
    };
  }

  const rawItems = source.programItems.filter((item) => {
    return isRawHeadingItem(item) || isRawSongItem(item) || isRawTextItem(item);
  });

  return {
    pageTitle: source.pageTitle || 'Double Impact',
    eyebrow: source.eyebrow || 'United in Harmony',
    intro:
      source.intro ||
      'Swipe door de sets, ontdek de gezamenlijke nummers en geef live je favorieten door.',
    programItems: normalizeRawItems(rawItems),
  };
}
