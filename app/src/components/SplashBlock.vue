<template>
  <div id="home" class="section section--home splashblock" data-anchor="home">
    <div class="overlay--dark"></div>
    <Loader />
    <div class="spacer"></div>
    <LazyImage media="media" />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import Loader from '@/components/Loader.vue';
import LazyImage from '@/components/LazyImage.vue';

export default defineComponent({
  name: 'SplashBlock',
  components: {
    Loader,
    LazyImage,
  },
  setup() {
    const media = {
      portrait: {
        srcset: [],
        src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg',
        sizes: '',
      },
      landscape: {
        srcset: [300, 768, 1024, 3504],
        src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/06/IMG_2061.jpg ',
        sizes: '(max-width: 3504px) 100vw, 3504px',
      },
    };
    return { media };
  },
});
</script>
