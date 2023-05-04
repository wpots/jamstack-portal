import { reactive, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { toDomain, fromDomain } from "./content.mapper";
import { getHomePageQuery } from "./queries/home.graphql";
import { getLayoutComponentsQuery } from "./queries/layout.graphql";
import { getTimeTableQuery } from "./queries/timeTableBlock.graphql";
import { getConcertPageQuery } from "./queries/concert.graphql";
import { getRepertoirBlock } from "./queries/repertoirBlock.graphql";
import { getRepertoirSongs } from "./queries/repertoirSongs.graphql";

export function useContent(id, ctx) {
  console.log(id);
  const enableQuery = reactive({
    layout: false,
    home: false,
    concert: false,
    timetable: false,
    repertoire: false,
    songs: false,
  });

  const store = useStore();
  const route = useRoute();

  const concertId = route.params.id;
  const date = fromDomain.idAsDate(concertId);
  const layoutName = ctx?.layout || "default";

  const { result: homepage } = useQuery(getHomePageQuery, { title: "Home" }, () => ({
    enabled: enableQuery.home,
  }));

  const { result: layout } = useQuery(getLayoutComponentsQuery, { title: layoutName }, () => ({
    enabled: enableQuery.layout,
  }));

  const { result: concert } = useQuery(getConcertPageQuery, { date }, () => ({
    enabled: enableQuery.concert,
  }));

  const { result: timetable } = useQuery(getTimeTableQuery, { date }, () => ({
    enabled: enableQuery.timetable,
  }));
  const { result: repertoire } = useQuery(getRepertoirBlock, { anchor: "ons-repertoire" }, () => ({
    enabled: enableQuery.repertoire,
  }));

  const { result: songs, refetch: refetchSongs } = useQuery(getRepertoirSongs, {}, () => ({
    enabled: enableQuery.songs,
  }));

  const fetchSongs = async () => {
    enableQuery.songs = true;
    console.log(enableQuery);
    await refetchSongs();
  };

  const sortSongs = () => genre =>
    getSongs.value.filter(song => song.genre.find(i => i.genre === genre));

  const layoutComponents = computed(() => toDomain.mapLayout(layout.value));
  const getHomepage = computed(() => toDomain.mapHomepage(homepage.value));
  const getConcertpage = computed(() => toDomain.mapConcertpage(concert.value));
  const getTimeTable = computed(() => toDomain.mapTimeTable(timetable.value));
  const getRepertoirePage = computed(() => toDomain.mapRepertoire(repertoire.value));
  const getSongs = computed(() => toDomain.mapSongs(songs.value));

  watch(layoutComponents, () => {
    if (layoutComponents.value?.footer) {
      store.dispatch("setLayout", { home: layoutComponents.value });
    }
  });
  const fetchLayout = () => {
    if (!store.state.layout?.footer) {
      enableQuery.layout = true;
    }
  };

  const getHeader = computed(() => store.state.layout?.home?.header);
  const getFooter = computed(() => store.state.layout?.home?.footer);

  onMounted(() => {
    if (id) {
      enableQuery[id] = true;
    }
    fetchLayout();
  });

  return {
    getHomepage,
    getConcertpage,
    getTimeTable,
    getRepertoirePage,
    fetchSongs,
    sortSongs,
    getHeader,
    getFooter,
  };
}
