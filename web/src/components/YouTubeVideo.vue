<template>
  <iframe :src="videoSrc" frameborder="0" allowfullscreen> </iframe>
</template>
<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'YouTubeVideo',

  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const videoSrc = computed(() => {
      return `https://www.youtube.com/embed/${props.videoId}`;
    });
    return { videoSrc };
  },
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;
iframe {
  width: 100%;
  height: 100%;
}
</style>
