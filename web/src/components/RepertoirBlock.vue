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
    <picture>
      <source
        srcset="http://www.goedgebekt.comhttp://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg"
        type="image/jpeg"
        media="(orientation:portrait)"
      />

      <img
        class="bg-img"
        src="http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-300x200.jpg"
        srcset="
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1.jpg          3108w,
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-300x200.jpg   300w,
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-768x512.jpg   768w,
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-1024x683.jpg 1024w
        "
        sizes="(max-width: 3108px) 100vw, 3108px"
      />
    </picture>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RepertoirList from './RepertoirList.vue';
import Sortable from './Sortable.vue';

export default defineComponent({
  name: 'RepertoirBlock',
  components: { RepertoirList, Sortable },
});
</script>
