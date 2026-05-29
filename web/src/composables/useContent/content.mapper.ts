import type {
  LinkedScore,
  ProgramItem,
  ProgramPage,
  ProgramSetItem,
  ProgramSongEntry,
} from './program.types';

interface CollectionWithItems {
  items?: unknown[];
}

interface LegacyTimeTableEntry {
  pageTitle?: string;
  intro?: { json: Record<string, unknown> };
  intermezzoRte?: { json: Record<string, unknown> };
  setlistCollection?: CollectionWithItems;
  setlist2Collection?: CollectionWithItems;
}

interface ProgramPageEntry {
  pageTitle?: string;
  eyebrow?: string;
  intro?: string;
  concertDatum?: string;
  programItemsCollection?: CollectionWithItems;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object';
};

const mapLinkedScore = (song: unknown): LinkedScore | undefined => {
  if (!isObject(song)) {
    return undefined;
  }

  return song as LinkedScore;
};

const getCollectionItems = (value: unknown): unknown[] => {
  if (!isObject(value)) {
    return [];
  }

  const collection = value as CollectionWithItems;
  return Array.isArray(collection.items) ? collection.items : [];
};

const getLegacyTimeTableEntry = (result: unknown): LegacyTimeTableEntry | null => {
  if (!isObject(result)) {
    return null;
  }

  const collection = result.pageBlockTimeTableCollection;
  const items = getCollectionItems(collection);
  const [entry] = items;

  return isObject(entry) ? (entry as LegacyTimeTableEntry) : null;
};

const getProgramPageEntry = (result: unknown): ProgramPageEntry | null => {
  if (!isObject(result)) {
    return null;
  }

  const collection = result.programPageCollection;
  const items = getCollectionItems(collection);
  const [entry] = items;

  return isObject(entry) ? (entry as ProgramPageEntry) : null;
};

const mapLegacySet = (title: string | undefined, set: unknown[]): ProgramSetItem => {
  const songs: ProgramSongEntry[] = set.flatMap((item: unknown) => {
    if (!isObject(item)) {
      return [];
    }

    const songList = isObject(item.scoresListCollection) ? item.scoresListCollection.items : [];

    if (!Array.isArray(songList)) {
      return [];
    }

    return songList
      .filter(isObject)
      .map((song) => ({
        title: typeof song.title === 'string' ? song.title : '',
        artist: typeof song.artist === 'string' ? song.artist : undefined,
        linkedScore: mapLinkedScore(song),
      }))
      .filter((song) => song.title);
  });

  return {
    type: 'set',
    title,
    songs,
  };
};

const mapLegacyTimeTableItems = (result: unknown): ProgramItem[] => {
  const item = getLegacyTimeTableEntry(result);

  if (!item) {
    return [];
  }

  const programItems: ProgramItem[] = [];

  if (isObject(item.intro)) {
    programItems.push({
      type: 'richText',
      body: item.intro as { json: Record<string, unknown> },
    });
  }

  const firstSetItems = getCollectionItems(item.setlistCollection);
  if (firstSetItems.length > 0) {
    programItems.push(mapLegacySet('Set 1', firstSetItems));
  }

  if (isObject(item.intermezzoRte)) {
    programItems.push({
      type: 'richText',
      body: item.intermezzoRte as { json: Record<string, unknown> },
    });
  }

  const secondSetItems = getCollectionItems(item.setlist2Collection);
  if (secondSetItems.length > 0) {
    programItems.push(mapLegacySet('Set 2', secondSetItems));
  }

  return programItems;
};

const mapProgramPageItems = (items: unknown[]): ProgramItem[] => {
  return items.flatMap<ProgramItem>((item: unknown) => {
    if (!isObject(item) || typeof item.__typename !== 'string') {
      return [];
    }

    if (item.__typename === 'ContentTypeRichText' && isObject(item.body)) {
      return [
        {
          type: 'richText',
          eyebrow: typeof item.eyebrow === 'string' ? item.eyebrow : undefined,
          title: typeof item.title === 'string' ? item.title : undefined,
          knockout: item.knockout === true,
          body: item.body as { json: Record<string, unknown> },
          ticketForm: typeof item.ticketForm === 'boolean' ? item.ticketForm : undefined,
          embeddedYouTubeId:
            typeof item.embeddedYouTubeId === 'string' ? item.embeddedYouTubeId : undefined,
        },
      ];
    }

    if (item.__typename === 'TeaserBlock') {
      return [{ type: 'teaser', cms: item }];
    }

    if (item.__typename === 'ProgramSetBlock') {
      const songs = getCollectionItems(item.songsCollection)
        ? getCollectionItems(item.songsCollection)
            .filter(isObject)
            .map((song) => ({
              title: typeof song.title === 'string' ? song.title : '',
              artist: typeof song.artist === 'string' ? song.artist : undefined,
              imageUrl: typeof song.imageUrl === 'string' ? song.imageUrl : undefined,
              linkedScore: mapLinkedScore(song.linkedRepertoire),
            }))
            .filter((song) => song.title)
        : [];

      return [
        {
          type: 'set',
          eyebrow: typeof item.eyebrow === 'string' ? item.eyebrow : undefined,
          title: typeof item.title === 'string' ? item.title : undefined,
          songs,
        },
      ];
    }

    return [];
  });
};

const toDomain = {
  textAsSlug: (title: string) => {
    return title.replace(' ', '-').toLowerCase();
  },
  dateAsId: (date: string) => {
    return date.split('T', 1)[0];
  },
  mapRepertoire: (result) => ({
    featuredSongs: result?.repertoirBlockCollection?.items[0].songsCollection?.items,
    genreFilterItems: result?.muziekGenresCollection?.items
      .filter((genre) => genre.linkedFrom?.scoreCollection?.total > 0)
      .map((item) => ({ genre: item.genre, total: item.linkedFrom.scoreCollection.total })),
  }),
  mapSongs: (result) =>
    result?.scoreCollection.items.map((song) => ({
      sys: { id: song.sys.id },
      id: song.sys.id,
      title: song.title,
      artist: song.artist,
      albumart: song.albumart,
      genre: song.genreCollection.items,
    })),
  mapTimeTable: (result: unknown): ProgramPage => ({
    pageTitle: getLegacyTimeTableEntry(result)?.pageTitle,
    programItems: mapLegacyTimeTableItems(result),
  }),
  mapProgramPage: (result: unknown): ProgramPage | null => {
    const page = getProgramPageEntry(result);

    if (!page) {
      return null;
    }

    const items = getCollectionItems(page.programItemsCollection);

    return {
      pageTitle: typeof page.pageTitle === 'string' ? page.pageTitle : undefined,
      eyebrow: typeof page.eyebrow === 'string' ? page.eyebrow : undefined,
      intro: typeof page.intro === 'string' ? page.intro : undefined,
      concertDatum: typeof page.concertDatum === 'string' ? page.concertDatum : undefined,
      programItems: mapProgramPageItems(items),
    };
  },
  mapConcertpage: (result) => {
    console.log(result);
    return result?.pageCollection?.items[0].pageBlocksCollection?.items;
  },
  mapHomepage: (result) => result?.homePageCollection?.items[0].pageBlocksCollection.items,
  mapLayout: (result) => ({
    header: {
      nav: result?.layoutCollection?.items[0]?.pageScrollerCollection.items,
      cta: result?.layoutCollection?.items[0]?.callToAction,
    },
    footer: result?.layoutCollection?.items[0]?.footer,
  }),
};
const fromDomain = {
  idAsDate: (id: string) => {
    // this works because date field in Contentful is 'date only'
    return `${id}T00:00:00.000Z`;
  },
};

export { toDomain, fromDomain };
