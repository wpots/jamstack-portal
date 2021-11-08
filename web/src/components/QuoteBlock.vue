<template>
  <div id="quotes" class="section section--quotes quoteblock">
    <div class="quotes">
      <Carousel :autoplay="3000" :wrap-around="true" :transition="1500">
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
    <LazyImage class="ding" :media="getMedia" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import assetQuery from '@/apollo/queries/assetQuery.gql';
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
  setup() {
    const { result } = useQuery(assetQuery, { id: '36AIo1n0AUMwNHAF9vyYbt' });
    const image = useResult(result, null, (data) => data.asset);

    const getMedia = computed(() => {
      const landscape = {
        src: image.value?.url,
        alt: image.value?.title,
      };
      return { landscape, classes: 'img--bg' };
    });
    return { getMedia };
  },
});
</script>
<style lang="scss" scoped>
.quoteblock {
  position: relative;
}
.quoteblock::v-deep(.ding) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}
</style>
