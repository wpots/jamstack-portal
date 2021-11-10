<template>
  <div id="quotes" class="section section--quotes quoteblock">
    <LazyImage
      class="bg-img quoteblock__bg"
      :media="getMedia"
      :lazySettings="{
        persist: true,
        settings: { margin: '0px 0px 0px 0px', threshold: [0, 1] },
      }"
      :sticky="true"
    />
    <div class="quotes">
      <Carousel :autoplay="5000" :wrap-around="true" :transition="1500">
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
    const { result } = useQuery(assetQuery, { id: '3fjaf1GXAV6u3mNVWurViI' });
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
