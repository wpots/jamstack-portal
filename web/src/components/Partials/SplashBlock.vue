<template>
  <transition appear>
    <div ref="root" class="section splashblock">
      <div class="overlay--dark"></div>
      <AppLoader :to="getScrollAnchor" />
      <LazyImage :media="getMedia" class="bg-img splashblock__bg" />
      <span id="next"></span>
    </div>
  </transition>
</template>
<script>
import { computed, defineComponent } from "vue";

import AppLoader from "@/components/AppLoader.vue";
import LazyImage from "@/components/LazyImage.vue";

export default defineComponent({
  name: "SplashBlock",
  components: {
    AppLoader,
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
      const landscape = {
        src: props.cms.mediaCollection.items[0].url,
        alt: props.cms.mediaCollection.items[0].title,
      };
      return { landscape };
    });

    const getScrollAnchor = computed(() => {
      return props.cms.scrollTo?.anchor ? props.cms.scrollTo?.anchor : "#next";
    });

    return { getMedia, getScrollAnchor };
  },
});
</script>
<style lang="scss" scoped>
.splashblock {
  width: 100%;
  height: 100vh;

  &::v-deep(.bg-img) {
    position: fixed !important;
    top: 0 !important;
    min-height: 100vh;
  }
}
</style>
