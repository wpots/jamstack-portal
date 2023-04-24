import { reactive, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { toDomain, fromDomain } from "./content.mapper";
import { getHomePageQuery } from "./queries/home.graphql";
import { getLayoutComponentsQuery } from "./queries/layout.graphql";
import { getTimeTableQuery } from "./queries/timeTableBlock.graphql";
import { getConcertPageQuery } from "./queries/concert.graphql";

export function useContent(id) {
  const enableQuery = reactive({
    layout: false,
    home: false,
    concert: false,
    timetable: false,
  });

  const store = useStore();
  const route = useRoute();

  const concertId = route.params.id;
  const date = fromDomain.idAsDate(concertId);

  const { result: homepage } = useQuery(getHomePageQuery, { title: "Home" }, () => ({
    enabled: enableQuery.home,
  }));

  const { result: layout } = useQuery(getLayoutComponentsQuery, { title: "Home" }, () => ({
    enabled: enableQuery.layout,
  }));

  const { result: concertpage } = useQuery(getConcertPageQuery, { date }, () => ({
    enabled: enableQuery.concert,
  }));

  const { result: timetable } = useQuery(getTimeTableQuery, { date }, () => ({
    enabled: enableQuery.timetable,
  }));

  const layoutComponents = computed(() => toDomain.mapLayout(layout.value));
  const getHomepage = computed(() => toDomain.mapHomepage(homepage.value));
  const getConcertpage = computed(() => toDomain.mapConcertpage(concertpage.value));
  const getTimeTable = computed(() => toDomain.mapTimeTable(timetable.value));

  watch(layoutComponents, () => {
    console.log("watch");
    if (layoutComponents.value?.footer) {
      store.dispatch("setLayout", { home: layoutComponents.value });
    }
  });

  const getHeader = computed(() => store.state.layout?.home?.header);
  const getFooter = computed(() => store.state.layout?.home?.footer);

  onMounted(() => {
    if (id) {
      enableQuery[id] = true;
      enableQuery.layout = true;
    }
  });

  return { getHomepage, getConcertpage, getTimeTable, getHeader, getFooter };
}
