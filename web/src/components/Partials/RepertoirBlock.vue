<template>
  <div class="section repertoirblock" data-anchor="het-repertoire">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import RepertoirList from '../RepertoirList.vue';
import Sortable from '../Sortable.vue';

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: 'RepertoirBlock',
  components: { RepertoirList, Sortable },
});
</script>
