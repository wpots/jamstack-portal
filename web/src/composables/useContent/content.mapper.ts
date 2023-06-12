const toDomain = {
  textAsSlug: (title: string) => {
    return title.replace(' ', '-').toLowerCase();
  },
  dateAsId: (date: string) => {
    return date.split('T', 1)[0];
  },
  mapRepertoire: result => ({
    featuredSongs: result?.repertoirBlockCollection?.items[0].songsCollection?.items,
    genreFilterItems: result?.muziekGenresCollection?.items
      .filter(genre => genre.linkedFrom?.scoreCollection?.total > 0)
      .map(item => ({ genre: item.genre, total: item.linkedFrom.scoreCollection.total })),
  }),
  mapSongs: result =>
    result?.scoreCollection.items.map(song => ({
      sys: { id: song.sys.id },
      id: song.sys.id,
      title: song.title,
      artist: song.artist,
      albumart: song.albumart,
      genre: song.genreCollection.items,
    })),
  mapTimeTable: result => ({
    pageTitle: result?.pageBlockTimeTableCollection?.items[0].pageTitle,
    introduction: result?.pageBlockTimeTableCollection?.items[0].introduction.content,
    intermezzo: result?.pageBlockTimeTableCollection?.items[0].intermezzo.content,
    firstSetlist: result?.pageBlockTimeTableCollection?.items[0].setlistCollection?.items,
    lastSetList: result?.pageBlockTimeTableCollection?.items[0].setlist2Collection?.items,
  }),
  mapConcertpage: result => {
    return result?.concertpageCollection?.items[0].pageBlocksCollection?.items;
  },
  mapHomepage: result => result?.homePageCollection?.items[0].pageBlocksCollection.items,
  mapLayout: result => ({
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
