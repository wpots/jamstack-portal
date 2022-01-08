<template>
  <div class="section repertoirblock" v-lazyload="{ callback: onComponentInView }">
    <div class="container-fluid">
      <article class="flex-box">
        <div class="page-header">
          <h1>{{ cms.title }}</h1>
          <ContentfulRichText v-if="cms.intro" :document="cms.intro" />
        </div>

        <div class="list list--figure row">
          <Sortable :items="filterGenres" @updatesortable="onUpdateSortable" />
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
import { ref, defineComponent, onErrorCaptured, computed } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import { getRepertoirBlock } from './repertoirBlock.graphql';
import { getRepertoirSongs } from './repertoirSongs.graphql';
import RepertoirList from '../RepertoirList.vue';
import Sortable from '../Sortable.vue';
import ContentfulRichText from '../ContentfulRichText.vue';

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: 'RepertoirBlock',
  components: { RepertoirList, Sortable, ContentfulRichText },
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

    const { result: block } = useQuery(getRepertoirBlock, { anchor: 'ons-repertoire' });
    const { result: sort, refetch, error } = useQuery(getRepertoirSongs, {}, queryOptions);
    const featuredSongs = useResult(
      block,
      null,
      (data) => data.repertoirBlockCollection.items[0].songsCollection.items,
    );
    const filterGenres = useResult(block, null, (data) => {
      const allGenres = data.muziekGenresCollection.items;
      const usedGenres = allGenres
        .filter((genre) => genre.linkedFrom.scoreCollection.total > 0)
        .map((i) => {
          return { genre: i.genre, total: i.linkedFrom.scoreCollection.total };
        });
      return usedGenres;
    });

    const onComponentInView = () => {
      //lazily get all songs when component is actually in viewport
      queryOptions.value.enabled = true;
      refetch();
    };

    const onUpdateSortable = (genre) => {
      sortBy.value = genre;
    };

    const allSongs = useResult(sort, [], (data) => {
      return data.scoreCollection.items;
    });

    const sortedSongs = computed(() => {
      if (sortBy.value && allSongs.value) {
        return allSongs?.value.filter((song) => {
          return song.genreCollection.items.find((i) => i.genre === sortBy.value);
        });
      }
      return featuredSongs.value;
    });

    onErrorCaptured((e) => {
      error.value = e;
      return true;
    });
    return { filterGenres, featuredSongs, sortedSongs, onComponentInView, onUpdateSortable, error };
  },
});
</script>
