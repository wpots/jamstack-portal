<template>
  <div class="section section--quotes quoteblock">
    <LazyImage class="bg-img quoteblock__bg" :media="getMedia" :sticky="true" />
    <div class="quotes">
      <Carousel
        :autoplay="8000"
        :wrap-around="true"
        :transition="1000"
        :pauseAutoplayOnHover="true"
      >
        <slide class="quote">
          <div class="quote__item">
            <q>Wij hebben van jullie genoten!</q>
            <div class="quote__origin">Flevo's mannen koor</div>
          </div>
        </slide>
        <slide class="quote">
          <div class="quote__item">
            <q>Fantastisch, een optreden vol energie.</q>
            <div class="quote__origin">Herman O.</div>
          </div>
        </slide>
      </Carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import LazyImage from '@/components/LazyImage.vue';

export default defineComponent({
  name: 'QuoteBlock',
  components: {
    Carousel,
    Slide,
    LazyImage,
  },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const getMedia = computed(() => {
      if (props.cms.backgroundImage) {
        const landscape = {
          src: props.cms.backgroundImage.url,
          alt: props.cms.backgroundImage.title,
        };
        return { landscape };
      }
      return false;
    });

    return { getMedia };
  },
});
</script>
<style lang="scss" scoped>
.quote {
  --font-family-quote: 'Satisfy';
}
</style>
