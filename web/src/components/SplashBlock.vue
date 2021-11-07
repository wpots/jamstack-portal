<template>
  <div id="home" class="section section--home splashblock" data-anchor="home">
    <div class="overlay--dark"></div>
    <Loader />
    <div class="spacer"></div>
    <LazyImage :media="getMedia" />
  </div>
</template>
<script>
// eslint-disable-next-line
import { computed, defineComponent } from 'vue';
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
.splashblock::v-deep .img--bg {
  position: fixed;
}
</style>
