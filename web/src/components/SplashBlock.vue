<template>
  <div id="home" ref="root" class="section splashblock" data-anchor="home" v-lazyload="loadConfig">
    <div class="overlay--dark"></div>
    <Loader :to="'#het-koor'" />
    <LazyImage :media="getMedia" class="bg-img splashblock__bg" />
  </div>
</template>
<script>
import { computed, defineComponent, reactive, ref } from 'vue';
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
  emits: ['splashInView'],
  setup(props, { emit }) {
    const root = ref(null);
    const loadConfig = reactive({
      callback: (e) => {
        if (e.ratio > 0.7) {
          emit('splashInView', { detail: e.direction });
        }
      },
      settings: {
        margin: '0px 0px 0px 0px',
        threshold: [0.25, 0.75],
      },
      persist: true,
    });

    const { result } = useQuery(assetQuery, { id: '36AIo1n0AUMwNHAF9vyYbt' });
    const image = useResult(result, null, (data) => data.asset);

    const getMedia = computed(() => {
      const landscape = {
        src: image.value?.url,
        alt: image.value?.title,
      };
      return { landscape };
    });

    return { getMedia, loadConfig, root };
  },
});
</script>
<style lang="scss" scoped>
.splashblock {
  width: 100vw;
  height: 100vh;

  &::v-deep(.bg-img) {
    position: fixed !important;
    top: 0 !important;
  }
}
</style>
