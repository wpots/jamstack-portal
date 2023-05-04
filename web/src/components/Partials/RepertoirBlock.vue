<template>
  <div class="section repertoirblock" v-lazyload="{ callback: onComponentInView }">
    <div class="container-fluid">
      <article class="row">
        <div class="page-header col-12">
          <h1>{{ cms.title }}</h1>
          <ContentfulRichText v-if="cms.intro" :document="cms.intro" />
        </div>

        <div class="col-12">
          <AppSortable :items="filterGenres" @updatesortable="onUpdateSortable" />
          <transition name="fade">
            <RepertoirList :songs="sortedSongs" />
          </transition>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import { useContent } from "../../composables/useContent";
import RepertoirList from "../RepertoirList.vue";
import AppSortable from "../AppSortable.vue";
import ContentfulRichText from "../ContentfulRichText.vue";

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: "RepertoirBlock",
  components: { RepertoirList, AppSortable, ContentfulRichText },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  setup() {
    const sortBy = ref(false);

    const { getRepertoirePage, sortSongs, fetchSongs } = useContent("repertoire");
    const filterGenres = computed(() => getRepertoirePage.value.genreFilterItems);
    const featuredSongs = computed(() => getRepertoirePage.value.featuredSongs);

    const onComponentInView = () => {
      fetchSongs();
    };

    const onUpdateSortable = genre => {
      sortBy.value = genre;
      // sortSongs(genre);
    };

    const sortedSongs = computed(() =>
      sortBy.value ? sortSongs(sortBy.value) : featuredSongs.value,
    );

    return { filterGenres, sortedSongs, onComponentInView, onUpdateSortable };
  },
});
</script>
