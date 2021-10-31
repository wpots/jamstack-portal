<template>
  <div id="home" class="section section--home splashblock" data-anchor="home">
    <div class="overlay--dark"></div>
    <Loader />
    <div class="spacer"></div>
    <LazyImage :media="media" />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import assetQuery from '@/apollo/queries/assetQuery.gql';
import Loader from '@/components/Loader.vue';
import LazyImage from '@/components/LazyImage.vue';

export default defineComponent({
  name: 'SplashBlock',
  components: {
    Loader,
    LazyImage,
  },
  setup() {
    const { result } = useQuery(assetQuery, { id: 'XRcvrUdZuKsuwKVxAmXYP' });
    const image = useResult(result, null, (data) => data.value);
    console.log(image);
    const media = {
      portrait: {
        srcset: [300, 768, 1024, 3504],
        src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg',
        sizes: '',
      },
      landscape: {
        srcset: [300, 768, 1024, 3504],
        src:
          'https://images.ctfassets.net/o4cfwi1cgj8a/XRcvrUdZuKsuwKVxAmXYP/0b3e59b8fc13a65073130ebc59f2b048/IMG_2061.jpg',
        sizes: '(max-width: 3504px) 100vw, 3504px',
        alt: 'lekker buiten',
      },
    };
    return { media };
  },
});
</script>
