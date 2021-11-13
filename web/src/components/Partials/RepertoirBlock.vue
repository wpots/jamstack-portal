<template>
  <div class="section repertoirblock">
    <div class="container-fluid">
      <article class="flex-box">
        <div class="page-header">
          <h1>{{ cms.title }}</h1>
        </div>

        <div class="list list--figure row">
          <Sortable :items="filterGenres" />
          <RepertoirList :songs="featuredSongs" />
        </div>
      </article>
    </div>
    <div v-if="error">
      {{ error.value }}
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onErrorCaptured } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import { getRepertoirBlock } from './repertoirBlock.graphql';
import RepertoirList from '../RepertoirList.vue';
import Sortable from '../Sortable.vue';

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: 'RepertoirBlock',
  components: { RepertoirList, Sortable },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const error = ref({});
    const { result } = useQuery(getRepertoirBlock, { anchor: 'ons-repertoire' });
    const featuredSongs = useResult(
      result,
      null,
      (data) => data.repertoirBlockCollection.items[0].songsCollection.items,
    );
    const filterGenres = useResult(result, null, (data) => {
      const allGenres = data.muziekGenresCollection.items;
      const usedGenres = allGenres
        .filter((genre) => genre.linkedFrom.scoreCollection.total > 0)
        .map((i) => {
          return { genre: i.genre, total: i.linkedFrom.scoreCollection.total };
        });
      return usedGenres;
    });
    onErrorCaptured((e) => {
      error.value = e;
      return true;
    });
    return { filterGenres, featuredSongs, error };
  },
});
</script>
