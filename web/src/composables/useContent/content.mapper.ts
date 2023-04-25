const toDomain = {
  textAsSlug: (title: string) => {
    return title.replace(" ", "-").toLowerCase();
  },
  dateAsId: (date: string) => {
    return date.split("T", 1)[0];
  },
  mapTimeTable: result => ({
    introduction: result?.pageBlockTimeTableCollection?.items[0].introduction,
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
