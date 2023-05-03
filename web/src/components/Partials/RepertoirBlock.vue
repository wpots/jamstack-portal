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
    <div v-if="error">
      {{ error.value }}
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onErrorCaptured, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { getRepertoirBlock } from "./repertoirBlock.graphql";
import { getRepertoirSongs } from "./repertoirSongs.graphql";
import { toDomain } from "../../composables/useContent/content.mapper";
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
    const queryOptions = ref({
      enabled: false,
    });

    const { result: block } = useQuery(getRepertoirBlock, { anchor: "ons-repertoire" });
    const { result: sort, refetch, error } = useQuery(getRepertoirSongs, {}, queryOptions);

    const featuredSongs = computed(() => toDomain.mapRepertoire(block?.value).featuredSongs);
    const filterGenres = computed(() => toDomain.mapRepertoire(block?.value).genreFilterItems);

    const onComponentInView = () => {
      //lazily get all songs when component is actually in viewport
      queryOptions.value.enabled = true;
      refetch();
    };

    const onUpdateSortable = genre => {
      sortBy.value = genre;
    };

    const allSongs = computed(() => sort?.value?.scoreCollection.items);

    const sortedSongs = computed(() => {
      if (sortBy.value && allSongs.value) {
        return allSongs?.value.filter(song => {
          return song.genreCollection.items.find(i => i.genre === sortBy.value);
        });
      }
      return featuredSongs.value;
    });

    onErrorCaptured(e => {
      error.value = e;
      return true;
    });
    return { filterGenres, featuredSongs, sortedSongs, onComponentInView, onUpdateSortable, error };
  },
});
</script>
