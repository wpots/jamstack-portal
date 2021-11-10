<template>
  <div id="het-repertoire" class="section section--het-repertoire" data-anchor="het-repertoire">
    <div class="container-fluid">
      <article class="flex-box" id="content-het-repertoire">
        <div class="page-header">
          <h1>Het Repertoire</h1>
        </div>

        <div class="list list--figure row" data-filter="">
          <Sortable />
          <RepertoirList />
        </div>
      </article>
    </div>
    <LazyImage
      class="bg-img repertoirblock__bg"
      :media="getMedia"
      :lazySettings="{
        persist: true,
        settings: { margin: '0px 0px 0px 0px', threshold: [0, 1] },
      }"
      :sticky="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import assetQuery from '@/apollo/queries/assetQuery.gql';
import RepertoirList from './RepertoirList.vue';
import Sortable from './Sortable.vue';
import LazyImage from '@/components/LazyImage.vue';
// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: 'RepertoirBlock',
  components: { RepertoirList, Sortable, LazyImage },
  setup() {
    const { result } = useQuery(assetQuery, { id: '292Wyu9B0CfcMVY4Ji9kRQ' });
    const image = useResult(result, null, (data) => data.asset);

    const getMedia = computed(() => {
      const landscape = {
        src: image.value?.url,
        alt: image.value?.title,
      };
      return { landscape, classes: 'bg-img' };
    });
    return { getMedia };
  },
});
</script>
